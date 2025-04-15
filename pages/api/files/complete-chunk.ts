import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ChunkWithoutFile } from "@/types/file";
import { chunkLimiter } from "@/lib/rate-limit";

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

    const { chunkId, checksum, encryptionIV } = req.body;

    if (!chunkId || !checksum || !encryptionIV) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Update chunk metadata
    const updatedChunk = (await (prisma as any).chunk.update({
      where: {
        id: chunkId,
      },
      data: {
        checksum,
        encryptionIV,
      },
    })) as ChunkWithoutFile;

    return res.status(200).json({ success: true, chunk: updatedChunk });
  } catch (error) {
    console.error("Chunk completion error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
