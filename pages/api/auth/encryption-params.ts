import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const headers = new Headers();
    if (req.headers.cookie) {
      headers.set('cookie', req.headers.cookie);
    }

    const session = await auth.api.getSession({
      headers,
    });

    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user's encryption parameters
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        encryptionSalt: true,
        encryptionParams: true,
        verifierHash: true,
        verifierSalt: true,
      },
    });

    if (!user?.encryptionSalt) {
      return res.status(404).json({ error: 'Encryption parameters not set' });
    }

    const params = JSON.parse(user.encryptionParams as string) ;

    if (!params) {
      return res.status(404).json({ error: 'Encryption parameters not found' });
    }

    return res.status(200).json({
      salt: user.encryptionSalt,
      verifierHash: user.verifierHash,
      verifierSalt: user.verifierSalt,
      ...params,
    });
  } catch (error) {
    console.error('Encryption params error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}