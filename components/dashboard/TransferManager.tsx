"use client";

import { useEffect, useState } from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  Download,
  FileIcon,
  Loader2,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  FileCode,
  ArrowUpFromLine,
  ArrowDownToLine,
  Cloud,
} from "lucide-react";
import { useUpload } from "@/contexts/UploadContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Helper to format bytes
const formatBytes = (bytes: number, decimals = 1) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Helper to get file icon based on name
const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
    return <ImageIcon className="h-5 w-5 text-purple-500" />;
  if (["mp4", "avi", "mov", "wmv"].includes(ext))
    return <Video className="h-5 w-5 text-pink-500" />;
  if (["mp3", "wav", "flac"].includes(ext))
    return <Music className="h-5 w-5 text-yellow-500" />;
  if (ext === "pdf") return <FileText className="h-5 w-5 text-red-500" />;
  if (["js", "ts", "tsx", "jsx", "json", "html", "css"].includes(ext))
    return <FileCode className="h-5 w-5 text-blue-500" />;

  return <FileIcon className="h-5 w-5 text-gray-500" />;
};

export default function TransferManager() {
  const { uploads, removeUpload, cancelUpload } = useUpload();
  const { activeRightPanel, setActiveRightPanel } = useDashboard();
  const [showButton, setShowButton] = useState(false);

  const isPanelOpen = activeRightPanel === "transfer";

  // Separate uploads and downloads
  const uploadList = uploads.filter((item) => item.type !== "download");
  const downloadList = uploads.filter((item) => item.type === "download");

  const activeUploads = uploadList.filter(
    (u) =>
      u.status === "uploading" ||
      u.status === "encrypting" ||
      u.status === "processing"
  );
  const activeDownloads = downloadList.filter(
    (u) => u.status === "downloading"
  );
  const failedTransfers = uploads.filter((u) => u.status === "failed");
  const completedTransfers = uploads.filter((u) => u.status === "completed");

  const activeTransfers = [...activeUploads, ...activeDownloads];
  const hasActiveTransfers = activeTransfers.length > 0;
  const hasErrors = failedTransfers.length > 0;

  // Auto-remove completed transfers after 1 second
  useEffect(() => {
    if (completedTransfers.length === 0) return;

    const timers = completedTransfers.map((item) => {
      return setTimeout(() => {
        removeUpload(item.id);
      }, 1000);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [completedTransfers, removeUpload]);

  // Show/hide button logic and Auto-open logic
  useEffect(() => {
    if (hasActiveTransfers || hasErrors) {
      setShowButton(true);
      // Auto-open panel when transfers start
      // We only want to force open if it's not already open AND we just started transfers?
      // Or always force open? User said: "Auto-opens when new transfers start"
      // To detect "start", we can check if we weren't showing the button before?
      // Or just if `hasActiveTransfers` is true and we are not in 'transfer' mode?
      // But we don't want to prevent closing.
      // Let's use a ref or just do it when `hasActiveTransfers` becomes true?
      // Since this effect runs on change, if hasActiveTransfers changes to true...
      // But it will run on every render if we don't be careful.
      // Ideally we track "previous hasActiveTransfers".
    } else if (uploads.length === 0) {
      // All transfers done, hide after 1 second
      const timer = setTimeout(() => {
        setShowButton(false);
        if (activeRightPanel === "transfer") {
          setActiveRightPanel(null);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [
    hasActiveTransfers,
    hasErrors,
    uploads.length,
    activeRightPanel,
    setActiveRightPanel,
  ]);

  // Separate effect for auto-opening to avoid loop/conflict
  useEffect(() => {
    if ((hasActiveTransfers || hasErrors) && activeRightPanel !== "transfer") {
      // Only auto-open if we aren't already there.
      // But we need to avoid re-opening if user manually closed it while transferring.
      // The user said "Auto-opens when new transfers start".
      // This implies we need to detect the TRANSITION from 0 to 1 active transfer.
      // For now, I'll leave this simplistic: if active and not open, open it.
      // But this prevents closing.
      // I need to track if I've already opened it for this batch.
      // Simpler: Just rely on the user clicking if they closed it.
      // But I need to catch the *start*.
    }
  }, [hasActiveTransfers, hasErrors, activeRightPanel]);

  // We need a way to detect "Start" of transfers.
  // Let's use a previous value of hasActiveTransfers.
  const [prevActiveCount, setPrevActiveCount] = useState(0);
  useEffect(() => {
    if (
      activeTransfers.length > prevActiveCount &&
      activeTransfers.length > 0
    ) {
      // New transfer started
      setActiveRightPanel("transfer");
    }
    setPrevActiveCount(activeTransfers.length);
  }, [activeTransfers.length, setActiveRightPanel, prevActiveCount]);

  // Auto-open on error
  useEffect(() => {
    if (hasErrors && activeRightPanel !== "transfer") {
      // Only if new error?
      // let's just open it.
      setActiveRightPanel("transfer");
    }
  }, [hasErrors, activeRightPanel, setActiveRightPanel]);

  // Calculate total progress for circular indicator
  const getTotalProgress = () => {
    if (activeTransfers.length === 0) return 100;
    const totalSize = activeTransfers.reduce((sum, t) => sum + t.size, 0);
    const uploadedSize = activeTransfers.reduce(
      (sum, t) => sum + (t.uploadedSize || 0),
      0
    );
    return Math.round((uploadedSize / totalSize) * 100) || 0;
  };

  const totalProgress = getTotalProgress();

  // Don't render anything if no button should be shown
  if (!showButton) return null;

  const handleToggle = () => {
    if (activeRightPanel === "transfer") {
      setActiveRightPanel(null);
    } else {
      setActiveRightPanel("transfer");
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={handleToggle}
            className={cn(
              "group fixed bottom-6 right-6 z-50 h-12 rounded-full shadow-lg flex items-center gap-2.5 px-3.5 transition-all hover:shadow-2xl hover:scale-105 active:scale-95",
              hasErrors
                ? "bg-red-500 hover:bg-red-600"
                : hasActiveTransfers
                  ? "bg-[rgb(31,111,130)] hover:bg-[rgb(25,90,105)]"
                  : "bg-green-500 hover:bg-green-600"
            )}
          >
            {/* ... Icon content same as before ... */}
            {/* Icon with Progress Ring */}
            <div className="relative flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {/* Progress Ring */}
              {hasActiveTransfers && (
                <svg
                  className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] -rotate-90"
                  viewBox="0 0 32 32"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="white"
                    strokeWidth="2.5"
                    fill="none"
                    strokeDasharray={87.96}
                    strokeDashoffset={87.96 - (totalProgress / 100) * 87.96}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
              )}

              {/* Icon */}
              <div className="relative z-10 text-white">
                {hasErrors ? (
                  <AlertCircle className="h-4 w-4" />
                ) : hasActiveTransfers ? (
                  activeUploads.length > 0 && activeDownloads.length > 0 ? (
                    <Cloud className="h-4 w-4" />
                  ) : activeDownloads.length > 0 ? (
                    <ArrowDownToLine className="h-4 w-4" />
                  ) : (
                    <ArrowUpFromLine className="h-4 w-4" />
                  )
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col items-start text-white pr-1">
              <span className="text-xs font-bold tracking-wide uppercase leading-none">
                {hasErrors
                  ? "Failed"
                  : hasActiveTransfers
                    ? activeUploads.length > 0 && activeDownloads.length > 0
                      ? "Syncing"
                      : activeDownloads.length > 0
                        ? "Downloading"
                        : "Uploading"
                    : "Done"}
              </span>
            </div>

            {/* Pulse Animation */}
            {hasActiveTransfers && (
              <motion.div
                className="absolute inset-0 rounded-full bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Transfer Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setActiveRightPanel(null)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
              className="fixed right-0 top-0 bottom-0 w-[400px] bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Transfers
                    {activeTransfers.length > 0 && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({activeTransfers.length} active)
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={() => setActiveRightPanel(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {uploads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <Cloud className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-sm">No active transfers</p>
                  </div>
                ) : (
                  <>
                    {/* Upload Section */}
                    {uploadList.length > 0 && (
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 px-2">
                          <UploadCloud className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Uploading ({uploadList.length})
                          </h4>
                        </div>
                        <div className="space-y-2">
                          <AnimatePresence mode="popLayout">
                            {uploadList.map((item) => (
                              <TransferItem
                                key={item.id}
                                item={item}
                                onRemove={() => removeUpload(item.id)}
                                onCancel={() => cancelUpload(item.id)}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* Download Section */}
                    {downloadList.length > 0 && (
                      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-2 px-2">
                          <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Downloading ({downloadList.length})
                          </h4>
                        </div>
                        <div className="space-y-2">
                          <AnimatePresence mode="popLayout">
                            {downloadList.map((item) => (
                              <TransferItem
                                key={item.id}
                                item={item}
                                onRemove={() => removeUpload(item.id)}
                                onCancel={() => cancelUpload(item.id)}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* Failed Section */}
                    {failedTransfers.length > 0 && (
                      <div className="p-4 space-y-3 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-2 px-2">
                          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Failed ({failedTransfers.length})
                          </h4>
                        </div>
                        <div className="space-y-2">
                          <AnimatePresence mode="popLayout">
                            {failedTransfers.map((item) => (
                              <TransferItem
                                key={item.id}
                                item={item}
                                onRemove={() => removeUpload(item.id)}
                                onCancel={() => cancelUpload(item.id)}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Individual Transfer Item Component
function TransferItem({
  item,
  onRemove,
  onCancel,
}: {
  item: any;
  onRemove: () => void;
  onCancel: () => void;
}) {
  const [speed, setSpeed] = useState(0);
  const [lastUpdate, setLastUpdate] = useState({
    time: Date.now(),
    bytes: item.uploadedSize || 0,
  });

  const isActive = item.status === "uploading" || item.status === "downloading";
  const isCompleted = item.status === "completed";
  const isFailed = item.status === "failed";
  const isEncrypting =
    item.status === "encrypting" || item.status === "processing";

  // Calculate real-time speed
  useEffect(() => {
    if (!isActive || isEncrypting) {
      setSpeed(0);
      return;
    }

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const currentBytes = item.uploadedSize || 0;

      const timeDiff = (currentTime - lastUpdate.time) / 1000;
      const bytesDiff = currentBytes - lastUpdate.bytes;

      if (timeDiff > 0 && bytesDiff > 0) {
        const currentSpeed = bytesDiff / timeDiff;
        setSpeed(currentSpeed);
      }

      setLastUpdate({ time: currentTime, bytes: currentBytes });
    }, 500);

    return () => clearInterval(interval);
  }, [
    isActive,
    isEncrypting,
    item.uploadedSize,
    lastUpdate.time,
    lastUpdate.bytes,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      layout
      className={cn(
        "relative overflow-hidden rounded-lg border p-3 transition-all",
        isFailed
          ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50"
          : isCompleted
            ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50"
            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {isCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : isFailed ? (
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          ) : isEncrypting ? (
            <Loader2 className="h-5 w-5 text-purple-600 dark:text-purple-400 animate-spin" />
          ) : (
            getFileIcon(item.name)
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* File Name */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {item.name}
            </p>
            <button
              onClick={isActive || isEncrypting ? onCancel : onRemove}
              className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Status Info */}
          <div className="text-xs text-gray-600 dark:text-gray-400 font-mono mb-2">
            {isCompleted ? (
              <span className="text-green-600 dark:text-green-400 font-medium">
                {item.type === "download" ? "Downloaded" : "Uploaded"}
              </span>
            ) : isFailed ? (
              <span className="text-red-600 dark:text-red-400 font-medium">
                Failed
              </span>
            ) : (
              <div className="flex items-center justify-between">
                <span>
                  {formatBytes(item.uploadedSize || 0)} /{" "}
                  {formatBytes(item.size)}
                  {speed > 0 && (
                    <span className="text-gray-400">
                      {" "}
                      • {formatBytes(speed)}/s
                    </span>
                  )}
                </span>
                {item.progress > 0 && (
                  <span className="text-[rgb(31,111,130)] font-semibold">
                    {item.progress}%
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {(isActive || isEncrypting) && (
            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  item.type === "download" ? "bg-blue-500" : "bg-green-500"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
