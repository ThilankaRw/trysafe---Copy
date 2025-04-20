"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  XCircle,
  UploadCloud,
  Download,
  RefreshCw,
  ExternalLink,
  ArrowUpFromLine,
  ArrowDownToLine,
  FileIcon,
  Loader2,
} from "lucide-react";
import { useUpload } from "@/contexts/UploadContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// Extend the UploadState interface to include our custom type property
interface ExtendedUploadState {
  id: string;
  name: string;
  progress: number;
  status:
    | "uploading"
    | "completed"
    | "failed"
    | "paused"
    | "encrypting"
    | "processing"
    | "downloading";
  size: number;
  uploadedSize: number;
  error?: string;
  startTime?: number;
  estimatedTimeRemaining?: number;
  type?: "download" | "upload"; // Custom type property for rendering
  chunks?: { status: string; downloadedBytes?: number; size?: number }[];
  _lastSmoothProgress?: number;
}

export default function TransferPanel() {
  const { uploads, removeUpload, pauseUpload, resumeUpload, cancelUpload } =
    useUpload();
  const [expanded, setExpanded] = useState(true);
  const [hasActivity, setHasActivity] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Track both active and recent transfers by type
  const activeUploads = uploads.filter(
    (upload) =>
      upload.status === "uploading" ||
      upload.status === "encrypting" ||
      upload.status === "processing"
  );

  const activeDownloads = uploads.filter(
    (upload) => upload.status === "downloading"
  );

  const errorTransfers = uploads.filter((upload) => upload.status === "failed");

  const completedTransfers = uploads.filter(
    (upload) => upload.status === "completed"
  );

  const activeTransfers = [...activeUploads, ...activeDownloads];

  // Get total progress for all active transfers
  const getTotalProgress = () => {
    if (activeTransfers.length === 0) return 100;

    const totalSize = activeTransfers.reduce((sum, t) => sum + t.size, 0);
    const uploadedSize = activeTransfers.reduce(
      (sum, t) => sum + t.uploadedSize,
      0
    );

    return Math.round((uploadedSize / totalSize) * 100) || 0;
  };
  // Calculate a smoother progress value that accounts for chunk transitions
  const calculateSmoothProgress = (upload: ExtendedUploadState) => {
    if (upload.progress === 100) return 100;

    // If it's a download with chunks, make the progress smoother
    if (
      upload.type === "download" &&
      upload.chunks &&
      upload.chunks.length > 0
    ) {
      const completedChunks = upload.chunks.filter(
        (c) => c.status === "completed"
      ).length;
      const inProgressChunk = upload.chunks.find(
        (c) => c.status === "downloading"
      );

      // Base progress on completed chunks
      let baseProgress = (completedChunks / upload.chunks.length) * 100;

      // Add partial progress of currently downloading chunk
      if (
        inProgressChunk &&
        inProgressChunk.downloadedBytes &&
        inProgressChunk.size
      ) {
        const chunkProgress =
          (inProgressChunk.downloadedBytes / inProgressChunk.size) * 100;
        const chunkContribution = (1 / upload.chunks.length) * chunkProgress;
        baseProgress += chunkContribution;
      }

      // Apply subtle smoothing to avoid jumps
      if (
        upload._lastSmoothProgress &&
        Math.abs(baseProgress - upload._lastSmoothProgress) > 10
      ) {
        // If jump is too large, smooth it out
        upload._lastSmoothProgress =
          upload._lastSmoothProgress +
          (baseProgress - upload._lastSmoothProgress) * 0.3;
      } else {
        upload._lastSmoothProgress = baseProgress;
      }

      return Math.min(99.9, upload._lastSmoothProgress); // Cap at 99.9% until fully complete
    }

    // For uploads or non-chunked downloads, use the reported progress
    return upload.progress;
  };

  // Show panel when there are transfers
  useEffect(() => {
    if (
      activeTransfers.length > 0 ||
      errorTransfers.length > 0 ||
      completedTransfers.length > 0
    ) {
      setHasActivity(true);
      setExpanded(true);
    } else {
      setHasActivity(false);
    }
  }, [
    activeTransfers.length,
    errorTransfers.length,
    completedTransfers.length,
  ]);

  // Auto-dismiss completed transfers after 5 seconds
  useEffect(() => {
    if (
      activeTransfers.length === 0 &&
      completedTransfers.length > 0 &&
      errorTransfers.length === 0
    ) {
      const timer = setTimeout(() => {
        completedTransfers.forEach((upload) => {
          removeUpload(upload.id);
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [
    activeTransfers.length,
    completedTransfers.length,
    errorTransfers.length,
    removeUpload,
  ]);

  if (!hasActivity) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed right-4 bottom-4 z-50 w-72 shadow-xl rounded-lg overflow-hidden backdrop-blur-sm bg-gray-800/95 border border-gray-700"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="px-3 py-2.5 border-b border-gray-700 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          {activeTransfers.length > 0 ? (
            <>
              {/* Progress ring indicator */}
              <div className="relative flex items-center justify-center w-5 h-5">
                <svg className="w-full h-full" viewBox="0 0 24 24">
                  <circle
                    className="text-gray-700"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="transparent"
                    r="10"
                    cx="12"
                    cy="12"
                  />
                  <circle
                    className={
                      activeDownloads.length > 0
                        ? "text-blue-500"
                        : "text-green-500"
                    }
                    strokeWidth="3"
                    strokeDasharray={62.83} // 2*PI*r where r=10
                    strokeDashoffset={
                      62.83 - (getTotalProgress() / 100) * 62.83
                    }
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="10"
                    cx="12"
                    cy="12"
                  />
                </svg>
                {/* Show type indicator in the center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {activeDownloads.length > 0 && activeUploads.length === 0 ? (
                    <ArrowDownToLine className="w-2.5 h-2.5 text-blue-400" />
                  ) : activeUploads.length > 0 &&
                    activeDownloads.length === 0 ? (
                    <ArrowUpFromLine className="w-2.5 h-2.5 text-green-400" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center space-x-1">
                  <p className="font-medium text-xs text-white">
                    {activeDownloads.length > 0 &&
                    activeUploads.length === 0 ? (
                      <span className="flex items-center">
                        <span className="text-blue-400 font-medium mr-1">
                          Downloading
                        </span>
                        <span>
                          {activeDownloads.length} file
                          {activeDownloads.length !== 1 ? "s" : ""}
                        </span>
                      </span>
                    ) : activeUploads.length > 0 &&
                      activeDownloads.length === 0 ? (
                      <span className="flex items-center">
                        <span className="text-green-400 font-medium mr-1">
                          Uploading
                        </span>
                        <span>
                          {activeUploads.length} file
                          {activeUploads.length !== 1 ? "s" : ""}
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="font-medium mr-1">
                          {activeTransfers.length} transfers
                        </span>
                        <span className="text-xs text-gray-400">
                          ({getTotalProgress()}%)
                        </span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </>
          ) : errorTransfers.length > 0 ? (
            <>
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="font-medium text-xs text-white">
                {errorTransfers.length} failed
              </p>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <p className="font-medium text-xs text-white">Complete</p>
            </>
          )}
        </div>
        <div>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Transfer list */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-h-80 overflow-y-auto">
              {/* Active transfers with grouped headers */}
              {activeUploads.length > 0 && (
                <div className="p-1.5">
                  <div className="flex items-center space-x-1.5 mb-1 px-1">
                    <ArrowUpFromLine className="w-3 h-3 text-green-500" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-green-500/80">
                      Uploads
                    </span>
                  </div>
                  <div className="space-y-1">
                    {activeUploads.map((upload) => (
                      <TransferItem
                        key={upload.id}
                        upload={upload}
                        isDownload={false}
                        onCancel={() => cancelUpload(upload.id)}
                        onRemove={() => removeUpload(upload.id)}
                        onRetry={() => resumeUpload(upload.id)}
                        calculateProgress={calculateSmoothProgress}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Show downloads section if any exist */}
              {activeDownloads.length > 0 && (
                <div className="p-1.5">
                  <div className="flex items-center space-x-1.5 mb-1 px-1">
                    <ArrowDownToLine className="w-3 h-3 text-blue-500" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-500/80">
                      Downloads
                    </span>
                  </div>
                  <div className="space-y-1">
                    {activeDownloads.map((upload) => (
                      <TransferItem
                        key={upload.id}
                        upload={{ ...upload, type: "download" }}
                        isDownload={true}
                        onCancel={() => cancelUpload(upload.id)}
                        onRemove={() => removeUpload(upload.id)}
                        onRetry={() => resumeUpload(upload.id)}
                        calculateProgress={calculateSmoothProgress}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Error transfers */}
              {errorTransfers.length > 0 && (
                <div className="p-1.5">
                  <div className="flex items-center space-x-1.5 mb-1 px-1">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-red-500/80">
                      Failed
                    </span>
                  </div>
                  <div className="space-y-1">
                    {errorTransfers.map((upload) => {
                      const wasDownload =
                        upload.status === "downloading" ||
                        (upload as ExtendedUploadState).type === "download";
                      return (
                        <TransferItem
                          key={upload.id}
                          upload={{
                            ...upload,
                            type: wasDownload
                              ? "download"
                              : (upload as ExtendedUploadState).type,
                          }}
                          isDownload={wasDownload}
                          onCancel={() => cancelUpload(upload.id)}
                          onRemove={() => removeUpload(upload.id)}
                          onRetry={() => resumeUpload(upload.id)}
                          calculateProgress={calculateSmoothProgress}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Completed transfers */}
              {completedTransfers.length > 0 && (
                <div className="p-1.5">
                  <div className="flex items-center space-x-1.5 mb-1 px-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-green-500/80">
                      Completed
                    </span>
                  </div>
                  <div className="space-y-1">
                    {completedTransfers.map((upload) => {
                      const wasDownload =
                        upload.status === "downloading" ||
                        (upload as ExtendedUploadState).type === "download";
                      return (
                        <TransferItem
                          key={upload.id}
                          upload={{
                            ...upload,
                            type: wasDownload
                              ? "download"
                              : (upload as ExtendedUploadState).type,
                          }}
                          isDownload={wasDownload}
                          onCancel={() => cancelUpload(upload.id)}
                          onRemove={() => removeUpload(upload.id)}
                          onRetry={() => resumeUpload(upload.id)}
                          calculateProgress={calculateSmoothProgress}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No transfers message */}
              {uploads.length === 0 && (
                <div className="py-6 text-center text-gray-500 text-sm">
                  <FileIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent transfers</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Individual transfer item component
function TransferItem({
  upload,
  isDownload,
  onCancel,
  onRemove,
  onRetry,
  calculateProgress,
}: {
  upload: ExtendedUploadState;
  isDownload: boolean;
  onCancel: () => void;
  onRemove: () => void;
  onRetry: () => void;
  calculateProgress: (upload: ExtendedUploadState) => number;
}) {
  // Use both the incoming isDownload prop and the upload type to determine if this is a download
  const actualIsDownload = isDownload || upload.type === "download";
  const isError = upload.status === "failed";
  const isComplete = upload.status === "completed";
  const isEncrypting = upload.status === "encrypting";
  const isProcessing = upload.status === "processing";
  const isActive = !isComplete && !isError;

  // Get file extension for icon
  const getFileExtension = () => {
    if (!upload.name) return "";
    const parts = upload.name.split(".");
    return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
  };

  const getFileTypeColor = () => {
    const ext = getFileExtension();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
      return "text-purple-400";
    if (["pdf"].includes(ext)) return "text-red-400";
    if (["doc", "docx", "txt"].includes(ext)) return "text-blue-400";
    if (["xls", "xlsx", "csv"].includes(ext)) return "text-green-400";
    if (["zip", "rar", "7z"].includes(ext)) return "text-yellow-400";
    return "text-gray-400";
  };

  // Get activity icon based on status
  const getActivityIcon = () => {
    if (isError)
      return <AlertCircle className="h-3 w-3 text-red-500 animate-pulse" />;
    if (isComplete) return <CheckCircle className="h-3 w-3 text-green-500" />;
    if (isEncrypting)
      return <Loader2 className="h-3 w-3 text-purple-500 animate-spin" />;
    if (isProcessing)
      return <Loader2 className="h-3 w-3 text-yellow-500 animate-spin" />;
    if (actualIsDownload)
      return <Download className="h-3 w-3 text-blue-500 animate-pulse" />;
    return <UploadCloud className="h-3 w-3 text-green-500" />;
  };

  // Get transfer speed
  const getTransferSpeed = () => {
    if (
      !upload.startTime ||
      upload.status === "paused" ||
      upload.status === "completed" ||
      upload.status === "failed"
    ) {
      return null;
    }

    const elapsedTimeMs = Date.now() - upload.startTime;
    if (elapsedTimeMs <= 0) return null;

    const elapsedTimeSeconds = elapsedTimeMs / 1000;
    const bytesPerSecond = upload.uploadedSize / elapsedTimeSeconds;

    return formatFileSize(bytesPerSecond) + "/s";
  };

  // Get status text
  const getStatusText = () => {
    if (isError) return "Failed";
    if (isComplete) return "Complete";
    if (isEncrypting) return "Encrypting...";
    if (isProcessing) return "Processing...";
    if (actualIsDownload) return "Downloading...";
    return "Uploading...";
  };

  return (
    <div
      className={`rounded p-1.5 bg-gray-800/80 border ${
        isError
          ? "border-red-900/50"
          : isComplete
            ? "border-green-900/30"
            : actualIsDownload
              ? "border-blue-900/40 bg-blue-950/20"
              : "border-green-900/30 bg-green-950/10"
      } hover:bg-gray-700/60 transition-colors shadow-sm flex items-start space-x-2`}
    >
      {/* File icon */}
      <div
        className={`w-6 h-6 rounded flex items-center justify-center ${getFileTypeColor()} bg-gray-900/50`}
      >
        <FileIcon className="h-3.5 w-3.5" />
      </div>

      <div className="flex-1 min-w-0">
        {/* Top row with filename and status */}
        <div className="flex justify-between items-center">
          <p
            className="text-xs font-medium text-gray-200 truncate pr-1"
            title={upload.name}
          >
            {upload.name}
          </p>
          <div className="flex items-center space-x-1 flex-shrink-0">
            {getActivityIcon()}
            <span
              className={`text-[9px] ${isError ? "text-red-400" : isEncrypting ? "text-purple-400" : actualIsDownload ? "text-blue-400" : "text-green-400"}`}
            >
              {isActive ? `${calculateProgress(upload)}%` : getStatusText()}
            </span>
          </div>
        </div>

        {/* Progress bar (not for errors) */}
        {!isError && isActive && (
          <div className="mt-1 mb-1 relative h-1.5">
            <div className="absolute inset-0 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 bottom-0 transition-all duration-300 rounded-full ${
                  isEncrypting
                    ? "bg-purple-500"
                    : isProcessing
                      ? "bg-yellow-500"
                      : actualIsDownload
                        ? "bg-blue-500"
                        : "bg-green-500"
                }`}
                style={{ width: `${calculateProgress(upload)}%` }}
                role="progressbar"
                aria-valuenow={calculateProgress(upload)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            {/* Animated chunk progress markers - only for downloads */}
            {actualIsDownload &&
              calculateProgress(upload) > 0 &&
              calculateProgress(upload) < 100 && (
                <div className="relative w-full">
                  {/* Improved smooth progress visualization with wave effect */}
                  <div
                    className="absolute top-0 bottom-0 left-0 h-1.5 overflow-hidden flex items-center"
                    style={{ width: `${calculateProgress(upload)}%` }}
                  >
                    <div className="absolute inset-0 bg-blue-200/20 animate-pulse" />

                    {/* Animated flow indicator to show continuous progress */}
                    <div
                      className="absolute h-full w-24 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent"
                      style={{
                        animation: "flowDownloadAnimation 1.2s linear infinite",
                        left: "-24px", // Start outside the container
                      }}
                    />
                  </div>

                  <style jsx>{`
                    @keyframes flowDownloadAnimation {
                      0% {
                        transform: translateX(0);
                      }
                      100% {
                        transform: translateX(100%);
                      }
                    }
                  `}</style>
                </div>
              )}

            {/* Animated wave effect for uploads - to differentiate from downloads */}
            {!actualIsDownload &&
              !isEncrypting &&
              !isProcessing &&
              calculateProgress(upload) > 0 &&
              calculateProgress(upload) < 100 && (
                <div className="relative w-full">
                  <div
                    className="absolute top-0 bottom-0 left-0 h-1.5 overflow-hidden"
                    style={{ width: `${calculateProgress(upload)}%` }}
                  >
                    <div
                      className="absolute h-full w-20 bg-gradient-to-r from-transparent via-green-300/30 to-transparent"
                      style={{
                        animation:
                          "flowUploadAnimation 1.5s ease-in-out infinite",
                        left: "-20px",
                      }}
                    />
                  </div>

                  <style jsx>{`
                    @keyframes flowUploadAnimation {
                      0% {
                        transform: translateX(0) scaleY(1);
                      }
                      50% {
                        transform: translateX(50%) scaleY(1.2);
                      }
                      100% {
                        transform: translateX(100%) scaleY(1);
                      }
                    }
                  `}</style>
                </div>
              )}
          </div>
        )}

        {/* Error message */}
        {isError && (
          <p
            className="text-[9px] text-red-400 truncate"
            title={upload.error || "Transfer failed"}
          >
            {upload.error || "Transfer failed"}
          </p>
        )}

        {/* File info: Size and speed */}
        {isActive && (
          <div className="flex justify-between items-center text-[9px] text-gray-400">
            <span>
              {formatFileSize(upload.uploadedSize || 0)} /{" "}
              {formatFileSize(upload.size)}
            </span>
            <span className="flex items-center">
              {getTransferSpeed() && (
                <>
                  <span className="font-mono mr-1">{getTransferSpeed()}</span>
                  {/* Add clear indicator of transfer type */}
                  {actualIsDownload ? (
                    <span className="text-blue-400 font-semibold bg-blue-950/30 px-1 rounded">
                      ↓
                    </span>
                  ) : (
                    <span className="text-green-400 font-semibold bg-green-950/30 px-1 rounded">
                      ↑
                    </span>
                  )}
                </>
              )}
            </span>
          </div>
        )}

        {isComplete && (
          <div className="flex justify-between items-center text-[9px] text-gray-400">
            <span>{formatFileSize(upload.size)}</span>
            <span>{actualIsDownload ? "Downloaded" : "Uploaded"}</span>
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="mt-1 flex-shrink-0">
        {isActive && (
          <button
            onClick={onCancel}
            className="p-0.5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
            aria-label="Cancel transfer"
          >
            <XCircle className="h-3.5 w-3.5" />
          </button>
        )}

        {isError && (
          <button
            onClick={onRetry}
            className="p-0.5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
            aria-label="Retry transfer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        )}

        {isComplete && (
          <button
            onClick={onRemove}
            className="p-0.5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
            aria-label="View file"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
