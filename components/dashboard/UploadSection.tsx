"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSecureStore } from "@/store/useSecureStore";
import { useUpload } from "@/contexts/UploadContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { toast } from "sonner";

export default function UploadSection() {
  const { isInitialized, uploadFile } = useSecureStore();
  const { addUpload, updateUpload } = useUpload();
  const { refreshFiles } = useDashboard();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!isInitialized) {
        toast.error(
          "Secure storage is not initialized. Please unlock your storage."
        );
        return;
      }

      for (const file of acceptedFiles) {
        const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        // Add to upload context
        addUpload({
          id: uploadId,
          name: file.name,
          size: file.size,
          uploadedSize: 0,
          progress: 0,
          status: "uploading",
          type: "upload",
        });

        try {
          // Call the real upload function
          await uploadFile(file, (progress) => {
            const uploadedSize = Math.floor((progress / 100) * file.size);
            updateUpload(uploadId, {
              uploadedSize: uploadedSize,
              progress: Math.round(progress),
              status: progress < 100 ? "uploading" : "encrypting",
            });
          });

          // Mark as completed
          updateUpload(uploadId, {
            uploadedSize: file.size,
            progress: 100,
            status: "completed",
          });

          // Refresh the file list to show the new file
          setTimeout(() => {
            refreshFiles();
          }, 500); // Small delay to ensure backend has processed
        } catch (error) {
          console.error("Upload error:", error);
          updateUpload(uploadId, {
            status: "failed",
          });
        }
      }
    },
    [isInitialized, uploadFile, addUpload, updateUpload, refreshFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: true,
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          File Upload
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your file uploads securely and efficiently.
        </p>
      </div>

      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-all duration-300 bg-gray-50 dark:bg-gray-900/50",
          isDragActive
            ? "border-[rgb(31,111,130)] bg-[rgb(31,111,130)]/5 scale-[1.01]"
            : "border-gray-300 dark:border-gray-700 hover:border-[rgb(31,111,130)]/50 hover:bg-gray-100 dark:hover:bg-gray-800/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <div className="mb-4 p-3 rounded-full bg-[rgb(31,111,130)]/10 text-[rgb(31,111,130)] group-hover:scale-110 transition-transform duration-300">
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            <span className="font-semibold text-[rgb(31,111,130)]">
              Click to upload
            </span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Any file type supported (encrypted automatically)
          </p>
        </div>
      </div>
    </div>
  );
}
