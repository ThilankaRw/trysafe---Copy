"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Upload, Plus, X } from "lucide-react";
import { useUpload } from "@/contexts/UploadContext";

interface UploadAreaProps {
  currentFolder: string;
}

export default function UploadArea({ currentFolder }: UploadAreaProps) {
  const { addUpload } = useUpload();
  const [isDragging, setIsDragging] = useState(false);
  const [showFilePicker, setShowFilePicker] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        addUpload({
          id: Date.now().toString(),
          name: file.name,
          progress: 0,
          status: "uploading",
          size: file.size,
          uploadedSize: 0,
        });
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress > 100) {
            clearInterval(interval);
            addUpload({
              id: Date.now().toString(),
              name: file.name,
              progress: 100,
              status: "completed",
              size: file.size,
              uploadedSize: file.size,
            });
          } else {
            addUpload({
              id: Date.now().toString(),
              name: file.name,
              progress,
              status: "uploading",
              size: file.size,
              uploadedSize: (file.size * progress) / 100,
            });
          }
        }, 500);
      });
    },
    [addUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <>
      <motion.div
        {...(getRootProps() as any)}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          isDragging
            ? "border-primary bg-primary/10 scale-105"
            : "border-gray-300 dark:border-gray-700 bg-white/30 dark:bg-gray-800/30"
        } backdrop-blur-md`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input {...getInputProps()} />
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isDragging ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Upload className="mx-auto w-16 h-16 text-primary filter drop-shadow-glow" />
          <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            Drag and drop files here
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            or click to select files
          </p>
        </motion.div>
      </motion.div>

      <motion.button
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-primary to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowFilePicker(true)}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {showFilePicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowFilePicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">
                Select Files to Upload
              </h2>
              <input
                {...(getInputProps() as any)}
                multiple
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
              />
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setShowFilePicker(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
