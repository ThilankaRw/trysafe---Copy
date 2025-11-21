import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ChunkWithoutFile } from "@/types/file";
import { chunkLimiter } from "@/lib/rate-limit";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import {
  getUserServerSecret,
  encryptChunkWithServerSecret,
} from "@/lib/server-key-management";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Apply rate limiting
    await chunkLimiter(req, res);

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const headers = new Headers();
    if (req.headers.cookie) {
      headers.set("cookie", req.headers.cookie);
    }

    const session = await auth.api.getSession({
      headers,
    });
    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const startTime = Date.now();

    const { chunkId, checksum, encryptionIV } = req.body;

    if (!chunkId || !checksum || !encryptionIV) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get chunk details
    const chunk = await (prisma as any).chunk.findUnique({
      where: { id: chunkId },
      include: { file: true },
    });

    if (!chunk) {
      return res.status(404).json({ error: "Chunk not found" });
    }

    // Verify ownership
    if (chunk.file.userId !== session.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get user's server secret for additional encryption layer
    const serverSecret = await getUserServerSecret(session.user.id);

    let serverEncrypted = false;
    let serverIV = null;
    let serverAuthTag = null;

    if (serverSecret) {
      try {
        // Download the chunk from S3
        const getCommand = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: chunk.s3Key,
        });

        const response = await s3Client.send(getCommand);

        if (response.Body) {
          const chunkData = Buffer.from(
            await response.Body.transformToByteArray()
          );

          // Apply server-side encryption
          const encryptionResult = encryptChunkWithServerSecret(
            chunkData,
            serverSecret
          );

          // Re-upload the encrypted chunk
          const putCommand = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: chunk.s3Key,
            Body: encryptionResult.encryptedData,
            ContentType: "application/octet-stream",
          });

          await s3Client.send(putCommand);

          serverEncrypted = true;
          serverIV = encryptionResult.iv;
          serverAuthTag = encryptionResult.authTag;

          console.log(`Applied server-side encryption to chunk ${chunkId}`);
        }
      } catch (serverEncryptionError) {
        console.error(
          "Server-side encryption failed for chunk:",
          serverEncryptionError
        );
        // Continue without server-side encryption - client-side encryption is still active
      }
    }

    // Update chunk metadata
    const updatedChunk = (await (prisma as any).chunk.update({
      where: {
        id: chunkId,
      },
      data: {
        checksum,
        encryptionIV,
        serverEncrypted,
        serverIV,
        serverAuthTag,
      },
    })) as ChunkWithoutFile;

    const duration = Date.now() - startTime;
    console.log(
      `[complete-chunk] chunk=${chunkId} user=${session.user.id} serverEncrypted=${serverEncrypted} duration=${duration}ms`
    );

    return res.status(200).json({ success: true, chunk: updatedChunk });
  } catch (error) {
    console.error("Chunk completion error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
