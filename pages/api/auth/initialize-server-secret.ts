import { NextApiRequest, NextApiResponse } from "next";
import { initializeUserServerSecret } from "@/lib/server-key-management";
import { auth } from "@/lib/auth";

/**
 * API endpoint to initialize server secret for a newly created user
 * This should be called immediately after successful user registration
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get the current session to verify the user
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session?.user?.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = session.user.id;

    // Initialize server secret for the user
    const success = await initializeUserServerSecret(userId);

    if (success) {
      return res.status(200).json({
        success: true,
        message: "Server secret initialized successfully",
      });
    } else {
      return res.status(500).json({
        error: "Failed to initialize server secret",
      });
    }
  } catch (error) {
    console.error("Server secret initialization error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
