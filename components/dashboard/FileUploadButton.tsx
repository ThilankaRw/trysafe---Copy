"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, CloudUpload } from "lucide-react";
import { useSecureStore } from "@/store/useSecureStore";
import { useUpload } from "@/contexts/UploadContext";
import { toast } from "sonner";

export function FileUploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isInitialized, uploadFile } = useSecureStore();
  const { addUpload, updateUpload } = useUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    if (!isInitialized) {
      toast.error("Secure storage is not initialized. Please log in again.");
      return;
    }

    const files = Array.from(e.target.files);

    for (const file of files) {
      try {
        const uploadId = `upload-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;

        addUpload({
          id: uploadId,
          name: file.name,
          size: file.size,
          uploadedSize: 0,
          progress: 0,
          status: "uploading",
          type: "upload",
        });

        await uploadFile(file, (progress) => {
          const uploadedSize = Math.floor((progress / 100) * file.size);
          updateUpload(uploadId, {
            uploadedSize: uploadedSize,
            progress: Math.round(progress),
            status: progress < 100 ? "uploading" : "encrypting",
          });
        });

        updateUpload(uploadId, {
          uploadedSize: file.size,
          progress: 100,
          status: "completed",
        });

        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileSelect}
      />
      <Button 
        onClick={() => fileInputRef.current?.click()} 
        className="bg-[rgb(31,111,130)] hover:bg-[rgb(25,90,105)] text-white"
      >
        <CloudUpload className="mr-2 h-4 w-4" />
        File Upload
      </Button>
    </>
  );
}

