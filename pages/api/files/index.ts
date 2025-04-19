import type { NextApiRequest, NextApiResponse } from "next";
import { Prisma } from "@prisma/client"; // Import Prisma types if needed
import { auth } from "@/lib/auth"; // Use the same auth import
import prisma from "@/lib/prisma"; // Use the shared prisma client
// import { readLimiter } from '@/lib/rate-limit'; // Assuming a separate limiter for reads? Or maybe none needed?

// Updated type definition for the file data returned to the frontend
// Reflects the actual fields in the Prisma schema
type FileData = {
  id: string;
  name: string;
  mimeType: string;
  size: number; // Mapped from originalSize
  uploadedAt: Date;
  isFolder: boolean; // Added isFolder
  parentFolderId?: string | null; // Add parentFolderId if needed for displaying hierarchy
};

// Type definition for the API response
type ApiResponse =
  | {
      files: FileData[];
    }
  | {
      message: string; // Using 'message' for errors
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Optional: Apply rate limiting if desired for file listing
  // try {
  //    // await readLimiter(req, res); // Use appropriate limiter if needed
  // } catch (limitError: any) {
  //    console.warn("Rate limit exceeded for /api/files:", limitError.message);
  //    // rate-limit middleware usually handles the response directly
  //    return;
  // }

  // Handle only GET requests
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    // Using 'message' field for error consistency
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  let session;
  try {
    // Use the same session retrieval method
    const headers = new Headers();
    if (req.headers.cookie) {
      headers.set("cookie", req.headers.cookie);
    }
    session = await auth.api.getSession({ headers });

    if (!session || !session.user) {
      console.warn("Unauthorized GET request to /api/files");
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (authError) {
    console.error("Authentication error in /api/files:", authError);
    return res.status(401).json({ message: "Authentication failed" });
  }

  const userId = session.user.id;

  // Fetch files for the authenticated user
  try {
    console.log(`[API /api/files] Fetching files for userId: ${userId}`);
    const userFiles = await prisma.file.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        mimeType: true,
        originalSize: true,
        uploadedAt: true,
        isFolder: true,
        parentFolderId: true,
      },
      orderBy: [{ isFolder: "desc" }, { name: "asc" }],
    });

    // Map the database result to the FileData type expected by the frontend
    const responseFiles: FileData[] = userFiles.map((file) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      size: file.originalSize,
      uploadedAt: file.uploadedAt,
      isFolder: file.isFolder,
      parentFolderId: file.parentFolderId,
    }));

    console.log(
      `[API /api/files] Found ${responseFiles.length} files for user ${userId}`
    );
    res.status(200).json({ files: responseFiles });
  } catch (error) {
    console.error(
      `[API /api/files] Error fetching files for user ${userId}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Internal server error while fetching files." });
  }
  // No finally block needed here as prisma instance is managed globally in @/lib/prisma
}
