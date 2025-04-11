import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { salt, verifierHash, verifierSalt, encryptionParams } = req.body;

    if (!salt || !verifierHash || !verifierSalt || !encryptionParams) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Update or create user's encryption settings
    const result = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        encryptionSalt: salt,
        encryptionVerifierHash: verifierHash,
        encryptionVerifierSalt: verifierSalt,
        encryptionParams: encryptionParams,
        encryptionEnabled: true,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Setup encryption error:', error);
    return res.status(500).json({ error: 'Failed to set up encryption' });
  }
}