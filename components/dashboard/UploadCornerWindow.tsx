"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Minimize2,
  Maximize2,
  CheckCircle,
  FileText,
  UploadCloud,
  ArrowLeft,
  Download,
} from "lucide-react";
import { useUpload } from "@/contexts/UploadContext";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadCornerWindow() {
  const { uploads, removeUpload, pauseUpload, resumeUpload, updateUpload } =
    useUpload();
  const [minimized, setMinimized] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [completedUploads, setCompletedUploads] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const hasShownCompletedRef = useRef(false);

  // Track active uploads
  const activeUploads = uploads.filter(
    (upload) => upload.status !== "completed" && upload.status !== "failed"
  );

  // Track completed uploads
  useEffect(() => {
    const newCompleted = uploads.filter(
      (upload) => upload.status === "completed"
    );

    if (newCompleted.length > 0) {
      // Use a functional update to properly merge with existing state
      setCompletedUploads((prev) => {
        // Create a map of existing IDs for quick lookup
        const existingIds = new Set(prev.map((u) => u.id));

        // Filter out only new completed uploads that aren't already in our list
        const uniqueNewCompleted = newCompleted.filter(
          (u) => !existingIds.has(u.id)
        );

        if (uniqueNewCompleted.length > 0) {
          // Only switch to completed view if we have new completed uploads
          // and there are no more active uploads
          if (activeUploads.length === 0 && !hasShownCompletedRef.current) {
            setShowCompleted(true);
            hasShownCompletedRef.current = true;
          }

          // Return a new array with all existing items plus unique new ones
          return [...prev, ...uniqueNewCompleted];
        }

        // Return the previous state unchanged if no new uploads
        return prev;
      });
    }
  }, [uploads, activeUploads.length]);

  // Show window when there are uploads
  useEffect(() => {
    if (activeUploads.length > 0 || completedUploads.length > 0) {
      setVisible(true);
    } else if (activeUploads.length === 0 && completedUploads.length === 0) {
      // Only hide the window if there are no uploads at all
      // This prevents the window from disappearing during the transition from active to completed
      setVisible(false);
    }
  }, [activeUploads.length, completedUploads.length]);

  // If user switches tabs, reset the "hasShownCompleted" flag when active uploads appear again
  useEffect(() => {
    if (activeUploads.length > 0) {
      hasShownCompletedRef.current = false;
      // If there are active uploads, switch back to active view
      setShowCompleted(false);
    }
  }, [activeUploads.length]);

  // Hide window when there's no activity and user closes it
  const handleClose = () => {
    setVisible(false);
    // Only clear completed uploads on explicit close
    setCompletedUploads([]);
    hasShownCompletedRef.current = false;
  };

  // If not visible, don't render anything
  if (!visible) return null;

  // Render minimized state
  if (minimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-40"
      >
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center space-x-2"
        >
          <UploadCloud className="w-5 h-5 text-[rgb(31,111,130)]" />          <span className="font-medium text-sm">
            {activeUploads.length > 0
              ? `${activeUploads.length} active ${hasDownloads(activeUploads) ? 'downloads' : 'uploads'}`
              : `${completedUploads.length} completed ${hasDownloads(completedUploads) ? 'downloads' : 'uploads'}`}
          </span>
          <Maximize2 className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-80 max-h-[400px] z-40"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          {showCompleted && completedUploads.length > 0 ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="font-medium">Completed Uploads</h3>
              <span className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded-full">
                {completedUploads.length}
              </span>
            </>
          ) : (
            <>
              {hasDownloads(activeUploads) ? (
                <Download className="w-5 h-5 text-blue-500" />
              ) : (
                <UploadCloud className="w-5 h-5 text-[rgb(31,111,130)]" />
              )}
              <h3 className="font-medium">
                {getActiveStatusLabel(activeUploads)}
              </h3>
              <span className="bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded-full">
                {activeUploads.length}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {/* Toggle button between active and completed */}
          {completedUploads.length > 0 && activeUploads.length > 0 && (
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              title={
                showCompleted ? "View active uploads" : "View completed uploads"
              }
            >
              {showCompleted ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
            </button>
          )}
          <button
            onClick={() => setMinimized(true)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[320px]">
        {showCompleted ? (
          // Completed uploads list
          completedUploads.length > 0 ? (
            <ul className="space-y-2">
              {completedUploads.map((upload) => (
                <li
                  key={upload.id}
                  className="flex items-center p-2 rounded bg-gray-50 dark:bg-gray-900"
                >
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      title={upload.name}
                    >
                      {upload.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(upload.size)}
                    </p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No completed uploads
            </div>
          )
        ) : // Active uploads list
        activeUploads.length > 0 ? (
          <ul className="space-y-3">
            {activeUploads.map((upload) => (
              <li key={upload.id} className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <span
                    className="text-sm font-medium truncate max-w-[200px]"
                    title={upload.name}
                  >
                    {upload.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(upload.size)}
                  </span>
                </div>
                <div className="flex justify-between mb-1">                  <span className="text-xs text-gray-500">
                    {getStatusLabel(upload.status, upload.progress, upload.type === "download" || upload.status === "downloading")}
                  </span>
                  <span className="text-xs">
                    {formatFileSize(upload.uploadedSize || 0)} /{" "}
                    {formatFileSize(upload.size)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-2">
                  <div
                    className="bg-[rgb(31,111,130)] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${upload.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
                    onClick={() =>
                      upload.status === "paused"
                        ? resumeUpload(upload.id)
                        : pauseUpload(upload.id)
                    }
                  >
                    {upload.status === "paused" ? "Resume" : "Pause"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : completedUploads.length > 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-2">All uploads completed!</p>
            <button
              onClick={() => setShowCompleted(true)}
              className="text-sm text-[rgb(31,111,130)] font-medium"
            >
              View completed files
            </button>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No active uploads
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Helper function to get status label
function getStatusLabel(status: string, progress: number, isDownload: boolean = false): string {
  switch (status) {
    case "uploading":
      return isDownload ? `Downloading... ${progress}%` : `Uploading... ${progress}%`;
    case "downloading":
      return `Downloading... ${progress}%`;
    case "encrypting":
      return isDownload ? "Decrypting..." : "Encrypting...";
    case "processing":
      return isDownload ? "Preparing download..." : "Processing...";
    case "paused":
      return isDownload ? "Download paused" : "Upload paused";
    case "completed":
      return isDownload ? "Downloaded" : "Uploaded";
    case "failed":
      return isDownload ? "Download failed" : "Upload failed";
    default:
      return `${status} ${progress}%`;
  }
}

// Helper function to check if there are downloads
function hasDownloads(uploads: any[]): boolean {
  return uploads.some((u) => u.status === "downloading");
}

// Helper function to get a label for active operations
function getActiveStatusLabel(uploads: any[]): string {
  const downloadCount = uploads.filter(u => u.type === "download" || u.status === "downloading").length;
  const uploadCount = uploads.length - downloadCount;
  
  if (downloadCount > 0 && uploadCount === 0) {
    return "downloads";
  } else if (uploadCount > 0 && downloadCount === 0) {
    return "uploads";
  } else {
    return "transfers";
  }
}
