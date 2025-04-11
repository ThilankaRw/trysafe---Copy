"use client"

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { UploadManager } from './UploadManager';
import { useEncryption } from '@/contexts/EncryptionContext';
import { Alert, AlertDescription } from '../ui/alert';

interface UploadAreaProps {
  currentFolder?: string;
}

export default function UploadArea({ currentFolder }: UploadAreaProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { isInitialized } = useEncryption();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!isInitialized) {
      toast.error('Please set up encryption first');
      return;
    }

    // Filter out files larger than 100MB
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum file size is 100MB.`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  }, [isInitialized]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const removeFile = useCallback((file: File) => {
    setFiles(prev => prev.filter(f => f !== file));
  }, []);

  const handleUploadComplete = useCallback(() => {
    setFiles([]);
  }, []);

  return (
    <>
      <div
        className="relative h-60 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700"
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        <motion.div
          initial={false}
          animate={{
            scale: isDragActive ? 0.95 : 1,
            opacity: isDragActive ? 0.75 : 1
          }}
          className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-background"
        >
          <motion.div
            animate={{
              scale: isDragActive ? 1.1 : 1,
              y: isDragActive ? -10 : 0
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex flex-col items-center"
          >
            <Upload className="w-16 h-16 text-primary filter drop-shadow-glow" />
            <p className="mt-4 text-lg font-semibold text-foreground">
              {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              or click to select files
            </p>
            {!isInitialized && (
              <Alert className="mt-4 max-w-md">
                <AlertDescription>
                  Please set up encryption in your security settings before uploading files.
                </AlertDescription>
              </Alert>
            )}
          </motion.div>
        </motion.div>
      </div>

      <UploadManager
        files={files}
        onRemoveFile={removeFile}
        onUploadComplete={handleUploadComplete}
      />
    </>
  );
}

