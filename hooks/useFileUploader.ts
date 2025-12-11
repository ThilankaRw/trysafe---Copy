import { useCallback } from "react";
import { useSecureStore } from "@/store/useSecureStore";
import { useUpload } from "@/contexts/UploadContext";
import { useDashboard } from "@/contexts/DashboardContext";
import { toast } from "sonner";

export function useFileUploader() {
  const { isInitialized, uploadFile } = useSecureStore();
  const { addUpload, updateUpload } = useUpload();
  const { refreshFiles } = useDashboard();

  const handleUpload = useCallback(
    async (files: File[]) => {
      if (!isInitialized) {
        toast.error(
          "Secure storage is not initialized. Please unlock your storage."
        );
        return;
      }

      for (const file of files) {
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

  return { handleUpload, isInitialized };
}

