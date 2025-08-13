"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { useUpload } from "@/contexts/UploadContext";
import { useSecureStore } from "@/store/useSecureStore";
import { toast } from "sonner";
import { UploadProgress } from "@/lib/secure-storage";

const MAX_DOWNLOAD_SIZE = 2 * 1024 * 1024 * 1024; // 2GB limit
const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks

interface FileDownloadButtonProps {
  fileId: string;
  fileName: string;
  fileSize?: number;
  className?: string;
  variant?:
    | "ghost"
    | "outline"
    | "default"
    | "secondary"
    | "destructive"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export function FileDownloadButton({
  fileId,
  fileName,
  fileSize = 0,
  className,
  variant = "ghost",
  size = "icon",
  children,
}: FileDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { addUpload, updateUpload } = useUpload();
  const { downloadFile } = useSecureStore();

  const handleDownload = async () => {
    if (isDownloading) return;

    // Size check
    if (fileSize > MAX_DOWNLOAD_SIZE) {
      toast.error(
        `File is too large to download (max size: ${MAX_DOWNLOAD_SIZE / (1024 * 1024)}MB)`
      );
      return;
    }

    // Create a unique ID for this download
    const downloadId = `download-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    try {
      setIsDownloading(true);

      // Add initial download entry to the upload context
      addUpload({
        id: downloadId,
        name: fileName,
        size: fileSize || 1, // Use known size if available
        uploadedSize: 0,
        progress: 0,
        status: "downloading",
        type: "download",
      });

      // Start the download process
      const fileBlob = await downloadFile(
        fileId,
        (progress: UploadProgress) => {
          // Validate progress data
          if (!progress || typeof progress.percentage !== "number") {
            throw new Error("Invalid progress data received");
          }

          // Update progress using the upload context
          updateUpload(downloadId, {
            size: progress.totalBytes,
            uploadedSize: progress.uploadedBytes,
            progress: Math.round(progress.percentage),
            status: progress.percentage < 100 ? "downloading" : "processing",
            type: "download",
          });
        }
      );

      // Validate the downloaded blob
      if (!fileBlob || !(fileBlob instanceof Blob)) {
        throw new Error("Downloaded file is invalid");
      }

      // Mark as completed when done
      updateUpload(downloadId, {
        uploadedSize: fileBlob.size,
        progress: 100,
        status: "completed",
        type: "download",
      });

      // Create download link and trigger browser download
      const url = URL.createObjectURL(fileBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.style.display = "none"; // Hide the element
      document.body.appendChild(a);

      // Use a promise to handle the download completion
      await new Promise((resolve, reject) => {
        a.onclick = resolve;
        a.onerror = reject;
        a.click();

        // Cleanup after a short delay
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve(true);
        }, 1000);
      });

      toast.success(`${fileName} downloaded successfully`);
    } catch (error) {
      console.error("Download error:", error);

      // Detailed error handling
      let errorMessage = "Download failed";
      if (error instanceof Error) {
        if (error.message.includes("storage not initialized")) {
          errorMessage = "Please unlock your secure storage first";
        } else if (error.message.includes("network")) {
          errorMessage = "Network error occurred while downloading";
        } else {
          errorMessage = error.message;
        }
      }

      // Update the status to failed with specific error
      updateUpload(downloadId, {
        status: "failed",
        error: errorMessage,
        type: "download",
      });

      toast.error(`Failed to download ${fileName}: ${errorMessage}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={isDownloading}
      className={className}
      title={isDownloading ? "Downloading..." : `Download ${fileName}`}
    >
      {children || <Download className="h-4 w-4" />}
    </Button>
  );
}
