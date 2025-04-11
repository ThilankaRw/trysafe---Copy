"use client"

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, X, AlertCircle, Loader2 } from 'lucide-react';
import { PassphrasePrompt } from '../secure-storage/PassphrasePrompt';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSecureStore } from '@/store/useSecureStore';
import { Card } from '../ui/card';
import { SecureFileStorage } from '@/lib/secure-storage';

interface UploadManagerProps {
  files: File[];
  onRemoveFile: (file: File) => void;
  onUploadComplete: () => void;
}

interface FileProgress {
  progress: number;
  status: 'pending' | 'encrypting' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

export function UploadManager({ files, onRemoveFile, onUploadComplete }: UploadManagerProps) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [fileProgress, setFileProgress] = useState<Record<string, FileProgress>>({});
  const [showPassphrasePrompt, setShowPassphrasePrompt] = useState(false);
  const [encryptionParams, setEncryptionParams] = useState(null);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);

  const updateFileProgress = (
    file: File,
    update: Partial<FileProgress>
  ) => {
    setFileProgress(prev => ({
      ...prev,
      [file.name]: {
        ...prev[file.name],
        ...update
      }
    }));
  };

  const processFileUpload = async (passphrase: string) => {
    if (!currentFile || !encryptionParams) return;

    try {
      updateFileProgress(currentFile, {
        status: 'encrypting',
        progress: 0
      });

      const fileStorage = new SecureFileStorage();
      await fileStorage.uploadFile(
        currentFile,
        passphrase,
        (progress) => {
          updateFileProgress(currentFile, { progress });
        },
        (status) => {
          updateFileProgress(currentFile, {
            status: status === 'completed' ? 'completed' :
                   status === 'failed' ? 'failed' :
                   status === 'uploading' ? 'uploading' : 'encrypting'
          });
        }
      );

      toast.success(`${currentFile.name} uploaded successfully`);
      onRemoveFile(currentFile);

      // Process next file in queue
      const remainingFiles = uploadQueue.filter(f => f !== currentFile);
      setUploadQueue(remainingFiles);

      if (remainingFiles.length > 0) {
        setCurrentFile(remainingFiles[0]);
        await prepareUpload(remainingFiles[0]);
      } else {
        setCurrentFile(null);
        onUploadComplete();
      }
    } catch (error) {
      console.error('Upload error:', error);
      updateFileProgress(currentFile, {
        status: 'failed',
        error: (error as Error).message || 'Upload failed'
      });
      toast.error(`Failed to upload ${currentFile.name}`);
    } finally {
      setShowPassphrasePrompt(false);
    }
  };

  const prepareUpload = async (file: File) => {
    try {
      const response = await fetch('/api/auth/encryption-params');
      if (!response.ok) {
        throw new Error('Failed to fetch encryption parameters');
      }
      
      const params = await response.json();
      setEncryptionParams(params);
      setShowPassphrasePrompt(true);
    } catch (error) {
      console.error('Upload preparation error:', error);
      updateFileProgress(file, {
        status: 'failed',
        error: 'Failed to prepare upload'
      });
      toast.error('Failed to prepare file upload');
    }
  };

  // Start upload when files are added
  const startUpload = useCallback(() => {
    if (files.length > 0 && !currentFile && uploadQueue.length === 0) {
      const newQueue = [...files];
      setUploadQueue(newQueue);
      setCurrentFile(newQueue[0]);
      prepareUpload(newQueue[0]);
    }
  }, [files, currentFile, uploadQueue]);

  // Start uploads when component mounts or files change
  useEffect(() => {
    startUpload();
  }, [startUpload]);

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 space-y-2">
      {files.map((file) => (
        <Card key={file.name} className="p-4 bg-white dark:bg-gray-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Upload className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium truncate max-w-[180px]">
                {file.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onRemoveFile(file)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full bg-primary"
                style={{
                  width: `${fileProgress[file.name]?.progress || 0}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {fileProgress[file.name]?.status === 'encrypting' && (
                  <span className="flex items-center">
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Encrypting...
                  </span>
                )}
                {fileProgress[file.name]?.status === 'uploading' && (
                  <span>Uploading: {Math.round(fileProgress[file.name]?.progress || 0)}%</span>
                )}
                {fileProgress[file.name]?.status === 'completed' && 'Upload complete'}
                {fileProgress[file.name]?.status === 'failed' && (
                  <span className="text-destructive">Upload failed</span>
                )}
              </span>
            </div>

            {fileProgress[file.name]?.error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {fileProgress[file.name].error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>
      ))}

      {encryptionParams && (
        <PassphrasePrompt
          isOpen={showPassphrasePrompt}
          onClose={() => {
            setShowPassphrasePrompt(false);
            setCurrentFile(null);
          }}
          onPassphraseEntered={processFileUpload}
          encryptionParams={encryptionParams}
          title="Enter Encryption Passphrase"
          description="Please enter your encryption passphrase to secure the file."
        />
      )}
    </div>
  );
}

