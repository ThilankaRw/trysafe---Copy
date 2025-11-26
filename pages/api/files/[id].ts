import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deleteLimiter } from "@/lib/rate-limit";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

type ApiResponse = {
  success?: boolean;
  message?: string;
  fileId?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only allow DELETE method
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  // Apply rate limiting for file deletion to prevent abuse
  try {
    await deleteLimiter(req, res);
  } catch (limitError) {
    console.warn("Rate limit exceeded for file deletion");
    return res
      .status(429)
      .json({ message: "Too many deletion requests, please try again later" });
  }

  // Authentication check
  let session;
  try {
    const headers = new Headers();
    if (req.headers.cookie) {
      headers.set("cookie", req.headers.cookie);
    }
    session = await auth.api.getSession({ headers });

    if (!session || !session.user) {
      console.warn("Unauthorized DELETE request to /api/files/[id]");
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (authError) {
    console.error("Authentication error in /api/files/[id]:", authError);
    return res.status(401).json({ message: "Authentication failed" });
  }

  const userId = session.user.id;
  const fileId = req.query.id as string;

  if (!fileId) {
    return res.status(400).json({ message: "Missing file ID" });
  }

  try {
    console.log(
      `[API /api/files/[id]] Attempting to delete file ${fileId} for user ${userId}`
    );

    // First, verify the file belongs to the user (authorization)
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
      select: {
        id: true,
        userId: true,
        isFolder: true,
        chunks: {
          select: {
            id: true,
            s3Key: true,
          },
        },
      },
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.userId !== userId) {
      console.warn(
        `Unauthorized deletion attempt for file ${fileId} by user ${userId}`
      );
      return res
        .status(403)
        .json({ message: "You don't have permission to delete this file" });
    }

    // Check if it's a folder and has child files
    if (file.isFolder) {
      const childFilesCount = await prisma.file.count({
        where: { parentFolderId: fileId },
      });

      if (childFilesCount > 0) {
        return res.status(400).json({
          message:
            "Cannot delete folder with files in it. Please delete the files first or use recursive deletion.",
        });
      }
    }

    // Begin transaction to ensure all related records are deleted properly
    await prisma.$transaction(async (tx) => {
      // If the file has chunks, delete them from S3 and database
      if (file.chunks && file.chunks.length > 0) {
        // Delete the chunks from S3
        try {
          const deleteCommand = new DeleteObjectsCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Delete: {
              Objects: file.chunks.map((chunk) => ({
                Key: chunk.s3Key,
              })),
            },
          });
          await s3Client.send(deleteCommand);
          console.log(`Deleted ${file.chunks.length} chunks from S3 for file ${fileId}`);
        } catch (s3Error) {
          console.error(`Error deleting chunks from S3 for file ${fileId}:`, s3Error);
          // Continue with database deletion even if S3 deletion fails
        }

        // Delete chunks from database
        await tx.chunk.deleteMany({
          where: { fileId: fileId },
        });
      }

      // Delete the file record
      await tx.file.delete({
        where: { id: fileId },
      });
    });

    console.log(`[API /api/files/[id]] Successfully deleted file ${fileId}`);
    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
      fileId: fileId,
    });
  } catch (error) {
    console.error(
      `[API /api/files/[id]] Error deleting file ${fileId}:`,
      error
    );
    return res
      .status(500)
      .json({ message: "Failed to delete file due to server error" });
  }
}


