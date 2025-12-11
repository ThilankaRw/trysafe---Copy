import { Prisma } from '@prisma/client';

export type File = Prisma.fileGetPayload<{
  include: { chunks: true };
}>;

export type FileWithoutChunks = Prisma.fileGetPayload<{}>;

export type Chunk = Prisma.chunkGetPayload<{
  include: { file: true };
}>;

export type ChunkWithoutFile = Prisma.chunkGetPayload<{}>;

export interface UploadProgress {
  totalBytes: number;
  uploadedBytes: number;
  percentage: number;
}