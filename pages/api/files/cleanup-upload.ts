import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { File } from "@/types/file";
import { uploadLimiter } from "@/lib/rate-limit";

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
    await uploadLimiter(req, res);

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

    const userId = session.user.id;
    const { fileId } = req.body;
    if (!fileId) {
      return res.status(400).json({ error: "File ID is required" });
    }

    // Get file and its chunks, ensuring user owns the file
    const fileDoc = (await (prisma as any).file.findFirst({
      where: {
        id: fileId,
        userId,
      },
      include: {
        chunks: true,
      },
    })) as File;

    if (!fileDoc) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete chunks from S3
    if (fileDoc.chunks.length > 0) {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Delete: {
          Objects: fileDoc.chunks.map((chunk: { s3Key: string }) => ({
            Key: chunk.s3Key,
          })),
        },
      });
      await s3Client.send(deleteCommand);
    }

    // Delete file and chunks from database
    await (prisma as any).file.delete({
      where: {
        id: fileId,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Upload cleanup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
