import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { Chunk } from '@/types/file';
import { Prisma } from '@prisma/client';
import { uploadLimiter } from '@/lib/rate-limit';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper to determine file category and chunk size
function getFileConfig(fileSize: number) {
  if (fileSize <= 10 * 1024 * 1024) { // 10MB
    return { category: 'Small', chunkSize: 1 * 1024 * 1024 }; // 1MB chunks
  } else if (fileSize <= 100 * 1024 * 1024) { // 100MB
    return { category: 'Medium', chunkSize: 5 * 1024 * 1024 }; // 5MB chunks
  } else {
    return { category: 'Large', chunkSize: 10 * 1024 * 1024 }; // 10MB chunks
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Apply rate limiting
    await uploadLimiter(req, res);
    console.log("req.headers", req.headers)

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  const headers = new Headers();
  if (req.headers.cookie) {
    headers.set('cookie', req.headers.cookie);
  }

  const session = await auth.api.getSession({
    headers,
  });

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = session.user.id;
    const { filename, mimeType, fileSize, parentFolderId } = req.body;

    if (!filename || !mimeType || !fileSize) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { category, chunkSize } = getFileConfig(fileSize);
    const totalChunks = Math.ceil(fileSize / chunkSize);
    const keyDerivationSalt = crypto.randomBytes(16).toString('hex');

    // Create file record using prisma transaction
    const fileDoc = await prisma.$transaction<{ file: any; chunks: Chunk[] }>(async (tx) => {
      const file = await (tx as any).file.create({
        data: {
          name: filename,
          originalSize: fileSize,
          mimeType,
          category,
          chunkSize,
          totalChunks,
          userId,
          parentFolderId,
          keyDerivationSalt,
        },
      });

      // Create chunks in the same transaction
      const chunks = await Promise.all(
        Array.from({ length: totalChunks }, async (_, index) => {
          const chunkId = crypto.randomUUID();
          return (tx as any).chunk.create({
            data: {
              fileId: file.id,
              s3Key: chunkId,
              chunkOrder: index,
              size: index === totalChunks - 1 ? fileSize % chunkSize || chunkSize : chunkSize,
              checksum: '', // Will be updated after upload
              encryptionIV: '', // Will be updated by client
            },
          });
        })
      );

      return { file, chunks };
    });

    // Generate pre-signed URLs for each chunk
    const chunkUploadUrls = await Promise.all(
      fileDoc.chunks.map(async (chunk: Chunk) => {
        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: chunk.s3Key,
          ContentType: 'application/octet-stream',
        });
        
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return {
          url: signedUrl,
          chunkId: chunk.id,
          s3Key: chunk.s3Key,
        };
      })
    );

    return res.status(200).json({
      fileId: fileDoc.file.id,
      keyDerivationSalt,
      chunkSize,
      totalChunks,
      uploadUrls: chunkUploadUrls,
    });
  } catch (error) {
    console.error('Upload initialization error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}