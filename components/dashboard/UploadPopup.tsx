"use client";

import { X, Pause, Play, Trash2 } from "lucide-react";
import { useUpload } from "@/contexts/UploadContext";

export default function UploadPopup({ onClose }: { onClose: () => void }) {
  const { uploads, removeUpload, pauseUpload, resumeUpload } = useUpload();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Ongoing Uploads</h2>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {uploads.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No active uploads
          </div>
        ) : (
          <ul className="space-y-3">
            {uploads.map((upload) => (
              <li key={upload.id} className="flex flex-col">
                <div className="flex justify-between mb-1">
                  <span
                    className="text-sm font-medium truncate max-w-[200px]"
                    title={upload.name}
                  >
                    {upload.name}
                  </span>
                  <span className="text-sm font-medium">
                    {upload.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                  <div
                    className="bg-[rgb(31,111,130)] h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${upload.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() =>
                      upload.status === "paused"
                        ? resumeUpload(upload.id)
                        : pauseUpload(upload.id)
                    }
                  >
                    {upload.status === "paused" ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => removeUpload(upload.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
