import {
  deriveKey,
  generateSalt,
  generateIV,
  arrayBufferToHex,
  hexToArrayBuffer,
  retryWithBackoff,
} from "./utils";

interface ChunkUploadInfo {
  url: string;
  checksum: string;
  encryptionIV: string;
}

interface ChunkDownloadInfo {
  url: string;
  checksum: string;
  encryptionIV: string;
  size: number;
}

export interface UploadProgress {
  totalBytes: number;
  uploadedBytes: number;
  percentage: number;
}

export class SecureFileStorage {
  private static async encryptChunk(
    chunk: ArrayBuffer,
    key: CryptoKey
  ): Promise<{ encryptedData: ArrayBuffer; iv: string }> {
    const iv = generateIV();
    const webCrypto =
      typeof window !== "undefined"
        ? window.crypto
        : typeof globalThis !== "undefined" && (globalThis as any).crypto
          ? (globalThis as any).crypto
          : undefined;
    const start = Date.now();

    const encryptedData = await webCrypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      chunk
    );

    const duration = Date.now() - start;
    try {
      console.log(
        `[encryptChunk] size=${chunk.byteLength} bytes iv=${arrayBufferToHex(iv.buffer as ArrayBuffer).slice(0, 8)}... duration=${duration}ms`
      );
    } catch (e) {
      // ignore logging errors
    }

    return {
      encryptedData,
      iv: arrayBufferToHex(iv.buffer as ArrayBuffer),
    };
  }

  private static async decryptChunk(
    encryptedChunk: ArrayBuffer,
    key: CryptoKey,
    iv: string
  ): Promise<ArrayBuffer> {
    const ivArray = new Uint8Array(hexToArrayBuffer(iv));
    const webCrypto =
      typeof window !== "undefined"
        ? window.crypto
        : typeof globalThis !== "undefined" && (globalThis as any).crypto
          ? (globalThis as any).crypto
          : undefined;

    return await webCrypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: ivArray,
      },
      key,
      encryptedChunk
    );
  }

  private static async calculateChecksum(data: ArrayBuffer): Promise<string> {
    const webCrypto =
      typeof window !== "undefined"
        ? window.crypto
        : typeof globalThis !== "undefined" && (globalThis as any).crypto
          ? (globalThis as any).crypto
          : undefined;
    const start = Date.now();
    const hashBuffer = await webCrypto.subtle.digest("SHA-256", data);
    const duration = Date.now() - start;
    try {
      console.log(
        `[checksum] size=${data.byteLength} bytes duration=${duration}ms`
      );
    } catch (e) {}
    return arrayBufferToHex(hashBuffer);
  }

  private static async deriveEncryptionKey(
    password: string,
    salt: string
  ): Promise<CryptoKey> {
    const start = Date.now();
    const keyMaterial = await deriveKey(password, salt);
    const duration = Date.now() - start;
    try {
      console.log(
        `[deriveEncryptionKey] salt=${salt.slice(0, 8)}... duration=${duration}ms`
      );
    } catch (e) {}

    return await keyMaterial;
  }

  async uploadChunk(
    chunk: Blob,
    url: string,
    onProgress: (progress: number) => void,
    retryAttempt = 0
  ): Promise<void> {
    return retryWithBackoff(
      async () => {
        const xhr = new XMLHttpRequest();

        await new Promise<void>((resolve, reject) => {
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
      },
      {
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 5000,
        onRetry: (error, attempt) => {
          console.warn(`Upload retry attempt ${attempt} due to error:`, error);
          onProgress(0); // Reset progress on retry
        },
      }
    );
  }

  async uploadFile(
    file: File,
    password: string,
    onProgress?: (progress: number) => void,
    onStatus?: (status: string) => void
  ): Promise<{ fileId: string; mimeType: string }> {
    let fileId: string | undefined;
    const overallStart = Date.now();

    try {
      onStatus?.("initializing");
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
        keyDerivationSalt,
        chunkSize,
      } = await initResponse.json();
      fileId = newFileId;

      // Derive encryption key
      const encryptionKey = await SecureFileStorage.deriveEncryptionKey(
        password,
        keyDerivationSalt
      );
      const totalChunks = uploadUrls.length;
      let uploadedChunks = 0;
      let totalProgress = 0;

      // Process each chunk
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        // Generate unique IV for each chunk and measure encryption/checksum performance
        const chunkArrayBuffer = await chunk.arrayBuffer();
        const encStart = Date.now();
        const encryptedChunk = await SecureFileStorage.encryptChunk(
          chunkArrayBuffer,
          encryptionKey
        );
        const encDuration = Date.now() - encStart;

        // Calculate chunk checksum
        const checksumStart = Date.now();
        const checksum = await SecureFileStorage.calculateChecksum(
          encryptedChunk.encryptedData
        );
        const checksumDuration = Date.now() - checksumStart;
        try {
          console.log(
            `[uploadFile] chunkIndex=${i} file=${file.name} encTime=${encDuration}ms checksumTime=${checksumDuration}ms chunkSize=${chunkArrayBuffer.byteLength}`
          );
        } catch (e) {}

        onStatus?.("uploading");
        await this.uploadChunk(
          new Blob([encryptedChunk.encryptedData]),
          uploadUrls[i].url,
          (chunkProgress) => {
            const chunkContribution = 100 / totalChunks;
            totalProgress =
              uploadedChunks * chunkContribution +
              (chunkProgress * chunkContribution) / 100;
            onProgress?.(totalProgress);
          }
        );

        // Mark chunk as complete
        await retryWithBackoff(
          async () => {
            const completeResponse = await fetch("/api/files/complete-chunk", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chunkId: uploadUrls[i].chunkId,
                checksum,
                encryptionIV: encryptedChunk.iv,
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
            onRetry: (error, attempt) => {
              console.warn(
                `Upload retry attempt ${attempt} due to error:`,
                error
              );
            },
          }
        );

        uploadedChunks++;
      }

      onStatus?.("completed");
      onProgress?.(100);

      // Log overall upload summary: duration and speed
      try {
        const durationMs = Date.now() - overallStart;
        const durationSec = Math.max(durationMs / 1000, 0.001);
        const speedBytesPerSec = Math.round(file.size / durationSec);
        const speedMBps = (speedBytesPerSec / (1024 * 1024)).toFixed(2);
        console.log(
          `[uploadSummary] file=${file.name} size=${file.size} bytes duration=${durationMs}ms speed=${speedMBps} MB/s (${speedBytesPerSec} B/s)`
        );
      } catch (e) {
        // ignore logging errors
      }

      // Make sure fileId is defined before returning
      if (!fileId) {
        throw new Error("File ID was not set during upload");
      }

      return { fileId, mimeType: file.type };
    } catch (error) {
      onStatus?.("failed");
      console.error("Upload failed:", error);

      // Cleanup failed upload
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
    }
  }

  static async downloadFile(
    fileId: string,
    password: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ data: Blob; filename: string; mimeType: string }> {
    try {
      const overallStart = Date.now();
      // Get file metadata and download URLs
      const prepareResponse = await fetch(
        `/api/files/prepare-download?fileId=${fileId}`
      );
      if (!prepareResponse.ok) {
        throw new Error("Failed to prepare download");
      }

      const { filename, mimeType, originalSize, keyDerivationSalt, chunks } =
        await prepareResponse.json();

      // Derive decryption key
      const decryptionKey = await this.deriveEncryptionKey(
        password,
        keyDerivationSalt
      );
      const decryptedChunks: ArrayBuffer[] = [];
      let downloadedBytes = 0;

      // Download and decrypt each chunk
      for (const chunk of chunks) {
        const response = await fetch(chunk.url);
        const encryptedData = await response.arrayBuffer();

        // Verify chunk integrity
        const checksum = await this.calculateChecksum(encryptedData);
        if (checksum !== chunk.checksum) {
          throw new Error("Chunk integrity check failed");
        }

        // Decrypt chunk
        const decryptedChunk = await this.decryptChunk(
          encryptedData,
          decryptionKey,
          chunk.encryptionIV
        );

        decryptedChunks.push(decryptedChunk);
        downloadedBytes += decryptedChunk.byteLength;

        onProgress?.({
          totalBytes: originalSize,
          uploadedBytes: downloadedBytes,
          percentage: (downloadedBytes / originalSize) * 100,
        });
      }

      // Combine chunks and create final blob
      const combinedArray = new Uint8Array(originalSize);
      let offset = 0;
      for (const chunk of decryptedChunks) {
        combinedArray.set(new Uint8Array(chunk), offset);
        offset += chunk.byteLength;
      }

      // Log download summary (size, chunks, duration, speed)
      try {
        const durationMs = Date.now() - overallStart;
        const durationSec = Math.max(durationMs / 1000, 0.001);
        const chunkCount = chunks.length || 0;
        const speedBytesPerSec = Math.round(downloadedBytes / durationSec);
        const speedMBps = (speedBytesPerSec / (1024 * 1024)).toFixed(2);
        const totalMB = (originalSize / (1024 * 1024)).toFixed(2);
        const avgChunkMB = (
          originalSize /
          Math.max(chunkCount, 1) /
          (1024 * 1024)
        ).toFixed(3);

        console.log(
          `\n[downloadSummary] fileId=${fileId} filename=${filename}\n` +
            `  totalSize=${originalSize} bytes (${totalMB} MB)\n` +
            `  chunks=${chunkCount} downloaded=${downloadedBytes} bytes avgChunk=${avgChunkMB} MB\n` +
            `  duration=${durationMs} ms (${durationSec.toFixed(2)} s)\n` +
            `  speed=${speedMBps} MB/s (${speedBytesPerSec} B/s)\n`
        );
      } catch (e) {
        // ignore logging errors
      }

      return {
        data: new Blob([combinedArray], { type: mimeType }),
        filename,
        mimeType,
      };
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  }
}
