import {
  deriveKey,
  generateSalt,
  generateIV,
  arrayBufferToHex,
  hexToArrayBuffer,
  retryWithBackoff,
} from "./utils";
import { PassphraseEncryption } from "./passphrase-encryption";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

interface ChunkMetadata {
  iv: string;
  checksum: string;
  size: number;
}

interface FileMetadata {
  chunks: ChunkMetadata[];
  originalSize: number;
  mimeType: string;
  name: string;
  encryptionParams: {
    salt: string;
    iterations: number;
    memCost: number;
    parallelism: number;
  };
}

export class SecureFileStorage {
  private encryption: PassphraseEncryption;

  constructor() {
    this.encryption = PassphraseEncryption.getInstance();
  }

  private async validateChunk(
    chunk: ArrayBuffer,
    checksum: string
  ): Promise<boolean> {
    const computedChecksum = await this.calculateChecksum(chunk);
    return computedChecksum === checksum;
  }

  private static calculateProgressPercentage(
    currentChunk: number,
    totalChunks: number,
    chunkProgress: number
  ): number {
    const chunkContribution = 100 / totalChunks;
    return (
      currentChunk * chunkContribution +
      (chunkProgress * chunkContribution) / 100
    );
  }

  async uploadFile(
    file: File,
    passphrase: string,
    onProgress?: (progress: number) => void,
    onStatus?: (status: string) => void
  ): Promise<{ fileId: string; mimeType: string }> {
    let fileId: string | undefined;

    try {
      onStatus?.("initializing");

      // Initialize upload and get signed URLs
      const initResponse = await fetch("/api/files/initialize-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          fileSize: file.size,
        }),
      });

      if (!initResponse.ok) {
        throw new Error("Failed to initialize upload");
      }

      const {
        fileId: newFileId,
        uploadUrls,
        encryptionParams,
      } = await initResponse.json();
      fileId = newFileId;

      // Initialize encryption with provided parameters
      const isValid = await this.encryption.initializeEncryption(
        passphrase,
        encryptionParams
      );
      if (!isValid) {
        throw new Error("Failed to initialize encryption");
      }

      const totalChunks = uploadUrls.length;
      let uploadedChunks = 0;

      // Process each chunk
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        // Encrypt chunk
        const encryptedChunk = await this.encryption.encryptChunk(
          await chunk.arrayBuffer()
        );

        // Calculate chunk checksum
        const checksum = await this.calculateChecksum(
          encryptedChunk.encryptedData
        );

        onStatus?.("uploading");

        // Upload encrypted chunk
        await this.uploadChunk(
          new Blob([encryptedChunk.encryptedData]),
          uploadUrls[i].url,
          (chunkProgress) => {
            const totalProgress = SecureFileStorage.calculateProgressPercentage(
              uploadedChunks,
              totalChunks,
              chunkProgress
            );
            onProgress?.(totalProgress);
          }
        );

        // Complete chunk upload
        await retryWithBackoff(
          async () => {
            const completeResponse = await fetch("/api/files/complete-chunk", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                fileId,
                chunkId: uploadUrls[i].chunkId,
                checksum,
                iv: encryptedChunk.iv,
              }),
            });

            if (!completeResponse.ok) {
              throw new Error("Failed to complete chunk upload");
            }
          },
          {
            maxAttempts: 3,
            initialDelay: 1000,
            maxDelay: 5000,
          }
        );

        uploadedChunks++;
      }

      onStatus?.("completed");
      onProgress?.(100);

      return { fileId: fileId!, mimeType: file.type };
    } catch (error) {
      onStatus?.("failed");
      console.error("Upload failed:", error);

      if (fileId) {
        try {
          await fetch("/api/files/cleanup-upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileId }),
          });
        } catch (cleanupError) {
          console.error("Failed to cleanup failed upload:", cleanupError);
        }
      }

      throw error;
    } finally {
      this.encryption.clearEncryption();
    }
  }

  static async downloadFile(
    fileId: string,
    passphrase: string,
    onProgress?: (progress: {
      totalBytes: number;
      downloadedBytes: number;
      percentage: number;
    }) => void
  ): Promise<{ data: Blob; filename: string; mimeType: string }> {
    const encryption = PassphraseEncryption.getInstance();
    const storageInstance = new SecureFileStorage();

    try {
      // Get file metadata and download URLs
      const metadataResponse = await fetch(`/api/files/${fileId}/metadata`);
      if (!metadataResponse.ok) {
        throw new Error("Failed to fetch file metadata");
      }

      const metadata: FileMetadata = await metadataResponse.json();

      // Initialize encryption
      const isValid = await encryption.initializeEncryption(
        passphrase,
        metadata.encryptionParams
      );

      if (!isValid) {
        throw new Error("Invalid passphrase");
      }

      const chunks: ArrayBuffer[] = [];
      let downloadedBytes = 0;

      // Download and decrypt each chunk
      for (let i = 0; i < metadata.chunks.length; i++) {
        const chunk = metadata.chunks[i];

        // Download encrypted chunk
        const response = await fetch(`/api/files/${fileId}/chunks/${i}`);
        if (!response.ok) {
          throw new Error(`Failed to download chunk ${i}`);
        }

        const encryptedData = await response.arrayBuffer();

        // Validate chunk integrity
        if (
          !(await storageInstance.validateChunk(encryptedData, chunk.checksum))
        ) {
          throw new Error(`Chunk ${i} integrity check failed`);
        }

        // Decrypt chunk
        const decryptedChunk = await encryption.decryptChunk(
          encryptedData,
          chunk.iv
        );
        chunks.push(decryptedChunk);

        downloadedBytes += decryptedChunk.byteLength;
        onProgress?.({
          totalBytes: metadata.originalSize,
          downloadedBytes,
          percentage: (downloadedBytes / metadata.originalSize) * 100,
        });
      }

      // Combine chunks
      const combinedArray = new Uint8Array(metadata.originalSize);
      let offset = 0;

      for (const chunk of chunks) {
        combinedArray.set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
      }

      return {
        data: new Blob([combinedArray], { type: metadata.mimeType }),
        filename: metadata.name,
        mimeType: metadata.mimeType,
      };
    } finally {
      encryption.clearEncryption();
    }
  }

  private async calculateChecksum(data: ArrayBuffer): Promise<string> {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return arrayBufferToHex(hashBuffer);
  }

  private async uploadChunk(
    chunk: Blob,
    url: string,
    onProgress: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress((event.loaded / event.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`HTTP Error: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error occurred"));
      xhr.onabort = () => reject(new Error("Upload aborted"));

      xhr.open("PUT", url);
      xhr.send(chunk);
    });
  }
}
