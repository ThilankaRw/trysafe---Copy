import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { File, Chunk } from "@/types/file";
import { downloadLimiter } from "@/lib/rate-limit";

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

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;
    const fileId = req.query.fileId as string;
    if (!fileId) {
      return res.status(400).json({ error: "File ID is required" });
    }

    // Get file metadata and ensure user has access
    const fileDoc = (await (prisma as any).file.findFirst({
      where: {
        id: fileId,
        userId,
      },
      include: {
        chunks: {
          orderBy: {
            chunkOrder: "asc",
          },
        },
      },
    })) as File;

    if (!fileDoc) {
      return res.status(404).json({ error: "File not found" });
    }

    // Generate pre-signed URLs for each chunk
    const downloadUrls = await Promise.all(
      fileDoc.chunks.map(async (chunk: any) => {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: chunk.s3Key,
        });

        const signedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });

        return {
          url: signedUrl,
          chunkOrder: chunk.chunkOrder,
          encryptionIV: chunk.encryptionIV,
          checksum: chunk.checksum,
        };
      })
    );

    return res.status(200).json({
      fileId: fileDoc.id,
      filename: fileDoc.name,
      mimeType: fileDoc.mimeType,
      originalSize: fileDoc.originalSize,
      keyDerivationSalt: fileDoc.keyDerivationSalt,
      chunkSize: fileDoc.chunkSize,
      totalChunks: fileDoc.totalChunks,
      chunks: downloadUrls,
    });
  } catch (error) {
    console.error("Download preparation error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
