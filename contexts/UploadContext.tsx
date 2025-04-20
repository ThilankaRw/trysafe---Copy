"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

interface UploadState {
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
}

interface UploadContextType {
  uploads: UploadState[];
  addUpload: (
    upload: Omit<UploadState, "startTime" | "estimatedTimeRemaining">
  ) => void;
  updateUpload: (id: string, update: Partial<UploadState>) => void;
  removeUpload: (id: string) => void;
  clearUploads: () => void;
  pauseUpload: (id: string) => void;
  resumeUpload: (id: string) => void;
  cancelUpload: (id: string) => void;
  getUploadProgress: (id: string) => number;
  getTotalProgress: () => {
    completed: number;
    total: number;
    percentage: number;
  };
}

const UploadContext = createContext<UploadContextType | null>(null);

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const uploadSpeedsRef = useRef<Record<string, number[]>>({});

  const addUpload = useCallback(
    (upload: Omit<UploadState, "startTime" | "estimatedTimeRemaining">) => {
      setUploads((prevUploads) => {
        const index = prevUploads.findIndex((u) => u.id === upload.id);
        if (index === -1) {
          return [...prevUploads, { ...upload, startTime: Date.now() }];
        }
        return prevUploads;
      });
    },
    []
  );

  const updateUpload = useCallback(
    (id: string, update: Partial<UploadState>) => {
      setUploads((prevUploads) => {
        const index = prevUploads.findIndex((u) => u.id === id);
        if (index === -1) return prevUploads;

        const currentUpload = prevUploads[index];
        const speeds = uploadSpeedsRef.current[id] || [];

        // Calculate upload speed and estimated time remaining
        if (
          update.uploadedSize &&
          update.uploadedSize > currentUpload.uploadedSize
        ) {
          const timeDiff = Date.now() - (currentUpload.startTime || Date.now());
          const sizeDiff = update.uploadedSize - currentUpload.uploadedSize;
          const speed = sizeDiff / (timeDiff / 1000); // bytes per second

          // Keep last 5 speed measurements for averaging
          speeds.push(speed);
          if (speeds.length > 5) speeds.shift();
          uploadSpeedsRef.current[id] = speeds;

          // Calculate average speed and estimated time
          const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
          const remaining = currentUpload.size - (update.uploadedSize || 0);
          const estimatedSeconds = remaining / avgSpeed;

          update.estimatedTimeRemaining = estimatedSeconds;
        }

        const newUploads = [...prevUploads];
        newUploads[index] = { ...currentUpload, ...update };
        return newUploads;
      });
    },
    []
  );

  const removeUpload = useCallback((id: string) => {
    setUploads((prevUploads) =>
      prevUploads.filter((upload) => upload.id !== id)
    );
    delete uploadSpeedsRef.current[id];
  }, []);

  const clearUploads = useCallback(() => {
    setUploads([]);
    uploadSpeedsRef.current = {};
  }, []);

  const pauseUpload = useCallback(
    (id: string) => {
      updateUpload(id, { status: "paused" });
    },
    [updateUpload]
  );

  const resumeUpload = useCallback(
    (id: string) => {
      updateUpload(id, { status: "uploading", startTime: Date.now() });
    },
    [updateUpload]
  );

  const cancelUpload = useCallback(
    (id: string) => {
      const upload = uploads.find((u) => u.id === id);
      if (upload) {
        updateUpload(id, {
          status: "failed",
          error: "Upload cancelled by user",
        });
      }
    },
    [uploads, updateUpload]
  );

  const getUploadProgress = useCallback(
    (id: string) => {
      const upload = uploads.find((u) => u.id === id);
      if (!upload) return 0;
      return (upload.uploadedSize / upload.size) * 100;
    },
    [uploads]
  );

  const getTotalProgress = useCallback(() => {
    const activeUploads = uploads.filter(
      (u) =>
        u.status === "uploading" ||
        u.status === "encrypting" ||
        u.status === "processing" ||
        u.status === "downloading"
    );

    const total = activeUploads.reduce((sum, upload) => sum + upload.size, 0);
    const completed = activeUploads.reduce(
      (sum, upload) => sum + upload.uploadedSize,
      0
    );
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return { completed, total, percentage };
  }, [uploads]);

  const value = {
    uploads,
    addUpload,
    updateUpload,
    removeUpload,
    clearUploads,
    pauseUpload,
    resumeUpload,
    cancelUpload,
    getUploadProgress,
    getTotalProgress,
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
}
