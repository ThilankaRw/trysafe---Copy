"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { useUpload } from "@/contexts/UploadContext";
import { useSecureStore } from "@/store/useSecureStore";
import { toast } from "sonner";
import { UploadProgress } from "@/lib/secure-storage";

interface FileDownloadButtonProps {
  fileId: string;
  fileName: string;
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

    // Create a unique ID for this download
    const downloadId = `download-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    try {
      setIsDownloading(true);

      // Add initial download entry to the upload context
      addUpload({
        id: downloadId,
        name: fileName,
        size: 1, // We don't know the size yet, will be updated
        uploadedSize: 0,
        progress: 0,
        status: "processing", // Reuse existing status
      });

      // Start the download process using a type adapter function
      const fileBlob = await downloadFile(
        fileId,
        (progress: UploadProgress) => {
          // Update progress using the upload context
          updateUpload(downloadId, {
            size: progress.totalBytes,
            uploadedSize: progress.uploadedBytes,
            progress: Math.round(progress.percentage),
            status: progress.percentage < 100 ? "downloading" : "encrypting",
          });
        }
      );

      // Mark as completed when done
      updateUpload(downloadId, {
        uploadedSize: fileBlob.size,
        progress: 100,
        status: "completed",
      });

      // Create download link and trigger browser download
      const url = URL.createObjectURL(fileBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      toast.success(`${fileName} downloaded successfully`);
    } catch (error) {
      console.error("Download error:", error);

      // Update the status to failed
      updateUpload(downloadId, {
        status: "failed",
        error: error instanceof Error ? error.message : "Download failed",
      });

      toast.error(
        `Failed to download ${fileName}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
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
    >
      {children || <Download className="h-4 w-4" />}
    </Button>
  );
}
