import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {
  getUserServerSecret,
  decryptChunkWithServerSecret,
} from "@/lib/server-key-management";
import { downloadLimiter } from "@/lib/rate-limit";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * API endpoint to download and decrypt a specific chunk
 * Handles server-side decryption if the chunk was server-encrypted
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Apply rate limiting
    await downloadLimiter(req, res);

    if (req.method !== "GET") {
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

    const chunkId = req.query.chunkId as string;
    if (!chunkId) {
      return res.status(400).json({ error: "Chunk ID is required" });
    }

    // Get chunk metadata and verify access
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

    // Download chunk from S3
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: chunk.s3Key,
    });

    const response = await s3Client.send(getCommand);

    if (!response.Body) {
      return res.status(404).json({ error: "Chunk data not found" });
    }

    let chunkData = Buffer.from(await response.Body.transformToByteArray());

    // Apply server-side decryption if chunk was server-encrypted
    if (chunk.serverEncrypted && chunk.serverIV && chunk.serverAuthTag) {
      const serverSecret = await getUserServerSecret(session.user.id);

      if (serverSecret) {
        try {
          const decryptedData = decryptChunkWithServerSecret(
            chunkData,
            serverSecret,
            chunk.serverIV,
            chunk.serverAuthTag
          );
          chunkData = Buffer.from(decryptedData);
          console.log(`Applied server-side decryption to chunk ${chunkId}`);
        } catch (decryptionError) {
          console.error(
            "Server-side decryption failed for chunk:",
            decryptionError
          );
          return res.status(500).json({ error: "Failed to decrypt chunk" });
        }
      } else {
        return res
          .status(500)
          .json({ error: "Server secret not available for decryption" });
      }
    }

    // Set appropriate headers
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Length", chunkData.length);
    res.setHeader("Cache-Control", "private, no-cache");

    // Send the chunk data
    res.status(200).send(chunkData);
  } catch (error) {
    console.error("Chunk download error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
