"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpload } from "../../contexts/UploadContext";
import { useSecureStore } from "@/store/useSecureStore";
import { toast } from "sonner";

interface FileWithPreview extends File {
  preview: string;
}

export function DragDropFileBox() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { addUpload } = useUpload();
  const { isInitialized, uploadFile } = useSecureStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // if (!isInitialized) {
      //   toast.error('Secure storage is not initialized. Please log in again.')
      //   return
      // }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles((prev) => [...prev, ...newFiles]);

      // Process each file for secure upload
      for (const file of acceptedFiles) {
        try {
          const uploadId = Date.now().toString(); // Temporary ID for progress tracking
          addUpload({
            id: uploadId,
            name: file.name,
            size: file.size,
            uploadedSize: 0,
            progress: 0,
            status: "uploading",
          });

          await uploadFile(file, (progress) => {
            const uploadedSize = Math.floor((progress / 100) * file.size);
            addUpload({
              id: uploadId,
              name: file.name,
              size: file.size,
              uploadedSize: uploadedSize,
              progress: Math.round(progress),
              status: "uploading",
            });
          });

          addUpload({
            id: uploadId,
            name: file.name,
            size: file.size,
            uploadedSize: file.size,
            progress: 100,
            status: "completed",
          });

          toast.success(`${file.name} uploaded successfully`);
        } catch (error) {
          console.error("Upload error:", error);
          toast.error(`Failed to upload ${file.name}`);

          // Clean up the failed upload from the list
          const newFiles = [...files];
          const failedFile = newFiles.find((f) => f.name === file.name);
          if (failedFile) {
            newFiles.splice(newFiles.indexOf(failedFile), 1);
            setFiles(newFiles);
            URL.revokeObjectURL(failedFile.preview);
          }
        }
      }
    },
    [addUpload, uploadFile, isInitialized, files]
  );

  const removeFile = (file: FileWithPreview) => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
    URL.revokeObjectURL(file.preview);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 100 * 1024 * 1024, // 100MB max file size
    accept: {
      // Allow all common file types
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/plain": [".txt"],
      "application/zip": [".zip"],
    },
  });

  return (
    <div className="mt-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? "border-[rgb(31,111,130)] bg-[rgb(31,111,130)]/10"
            : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <input {...getInputProps()} />
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isDragActive ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Upload className="mx-auto h-12 w-12 text-[rgb(31,111,130)] filter drop-shadow-glow" />
          <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            Drag & drop files here
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Files will be encrypted before upload
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 space-y-2"
          >
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded shadow-sm"
              >
                <div className="flex items-center space-x-2">
                  <File className="h-5 w-5 text-[rgb(31,111,130)]" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
