"use client";

import { X, Pause, Play, Trash2 } from "lucide-react";
import { useUpload } from "@/contexts/UploadContext";

export default function UploadPopup({ onClose }: { onClose: () => void }) {
  const { uploads, removeUpload } = useUpload();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Ongoing Uploads</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <ul className="space-y-2">
          {uploads.map((upload) => (
            <li key={upload.id} className="flex items-center">
              <div className="flex-1">
                <div className="flex justify-between">
                  <span>{upload.name}</span>
                  <span>{upload.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-[rgb(31,111,130)] h-2.5 rounded-full"
                    style={{ width: `${upload.progress}%` }}
                  ></div>
                </div>
              </div>
              <button className="ml-2">
                {upload.status === "paused" ? (
                  <Play className="w-5 h-5" />
                ) : (
                  <Pause className="w-5 h-5" />
                )}
              </button>
              <button className="ml-2" onClick={() => removeUpload(upload.id)}>
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
