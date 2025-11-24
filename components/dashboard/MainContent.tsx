import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Folder,
  MoreVertical,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Code,
  File,
  Briefcase,
  Camera,
  FolderOpen,
  Download,
  Trash2,
  Info,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileDownloadButton } from "./FileDownloadButton";
import { toast } from "sonner";

// Define the type for the file data
type FileData = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  encrypted: boolean;
  createdAt?: string; // Assuming we might have this, or I'll mock it
  updatedAt?: string;
};

interface MainContentProps {
  files: FileData[];
  isLoading: boolean;
  onFileDelete: (fileId: string) => void;
}

const mockFolders = [
  {
    name: "Fonts",
    count: "1,125 files",
    size: "213.8 MB",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    name: "Vacation Photos",
    count: "3,155 files",
    size: "9.7 GB",
    icon: Camera,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  {
    name: "Work Files",
    count: "25 files",
    size: "185.8 MB",
    icon: Briefcase,
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  {
    name: "Projects",
    count: "15 files",
    size: "12.8 MB",
    icon: FolderOpen,
    color: "text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    name: "FTP Project",
    count: "1,347 files",
    size: "6.8 GB",
    icon: Folder,
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  {
    name: "Music",
    count: "1,125 files",
    size: "3.5 GB",
    icon: Music,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
];

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif"].includes(ext || ""))
    return <ImageIcon className="w-5 h-5 text-purple-500" />;
  if (["mp4", "mov", "avi"].includes(ext || ""))
    return <Video className="w-5 h-5 text-pink-500" />;
  if (["mp3", "wav"].includes(ext || ""))
    return <Music className="w-5 h-5 text-yellow-500" />;
  if (["pdf", "doc", "docx", "txt"].includes(ext || ""))
    return <FileText className="w-5 h-5 text-blue-500" />;
  if (["js", "ts", "tsx", "html", "css"].includes(ext || ""))
    return <Code className="w-5 h-5 text-green-500" />;
  return <File className="w-5 h-5 text-gray-500" />;
};

export default function MainContent({
  files,
  isLoading,
  onFileDelete,
}: MainContentProps) {
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    setDeletingFileId(fileId);
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      onFileDelete(fileId);
      toast.success(`${fileName} deleted successfully`);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(`Failed to delete ${fileName}`);
    } finally {
      setDeletingFileId(null);
    }
  };

  const handleShowInfo = (file: FileData) => {
    toast.info(
      `File: ${file.name}\nSize: ${formatSize(file.size)}\nType: ${file.mimeType}\nEncrypted: ${file.encrypted ? "Yes" : "No"}`,
      { duration: 5000 }
    );
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-white dark:bg-gray-950">
      {/* My Folder Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            My Folder
          </h2>
          <button className="text-sm font-medium text-[rgb(31,111,130)] hover:underline">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFolders.map((folder, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                    folder.bg
                  )}
                >
                  <folder.icon className={cn("w-6 h-6", folder.color)} />
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                  {folder.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {folder.count} | {folder.size}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Used Files Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recently Used Files
          </h2>
          <button className="text-sm font-medium text-[rgb(31,111,130)] hover:underline">
            View All
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-6 pl-4">File Name</div>
              <div className="col-span-3">Size</div>
              <div className="col-span-3 text-right pr-4">Last Updated</div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {files.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No recent files found.
                </div>
              ) : (
                files.map((file) => (
                  <div
                    key={file.id}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                  >
                    <div className="col-span-6 flex items-center gap-4">
                      <Checkbox className="data-[state=checked]:bg-[rgb(31,111,130)] border-gray-300" />
                      <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                        {getFileIcon(file.name)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white truncate pr-4">
                        {file.name}
                      </span>
                    </div>
                    <div className="col-span-3 text-sm text-gray-500 font-medium">
                      {formatSize(file.size)}
                    </div>
                    <div className="col-span-3 text-right flex items-center justify-end gap-4">
                      <span className="text-sm text-gray-500">
                        {file.updatedAt
                          ? new Date(file.updatedAt).toLocaleDateString()
                          : "Today"}
                      </span>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 text-gray-400 hover:text-[rgb(31,111,130)] hover:bg-[rgb(31,111,130)]/10 transition-all p-1.5 rounded-lg outline-none">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          sideOffset={5}
                          className="w-48 p-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150"
                        >
                          <DropdownMenuItem
                            className="group/item rounded-lg p-2 cursor-pointer gap-2 text-gray-600 dark:text-gray-300 focus:bg-[rgb(31,111,130)]/90 focus:text-white transition-colors text-sm outline-none font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              const downloadBtn = document.getElementById(
                                `download-${file.id}`
                              );
                              downloadBtn?.click();
                            }}
                          >
                            <Download className="w-4 h-4 text-gray-500 dark:text-gray-400 group-focus/item:text-white" />
                            <span>Download</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="group/item rounded-lg p-2 cursor-pointer gap-2 text-gray-600 dark:text-gray-300 focus:bg-[rgb(31,111,130)]/90 focus:text-white transition-colors text-sm outline-none font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowInfo(file);
                            }}
                          >
                            <Info className="w-4 h-4 text-gray-500 dark:text-gray-400 group-focus/item:text-white" />
                            <span>File Info</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />

                          <DropdownMenuItem
                            className="group/item rounded-lg p-2 cursor-pointer gap-2 text-red-600 focus:bg-red-500/90 focus:text-white dark:text-red-400 dark:focus:bg-red-600/90 transition-colors text-sm outline-none font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(file.id, file.name);
                            }}
                            disabled={deletingFileId === file.id}
                          >
                            <Trash2 className="w-4 h-4 group-focus/item:text-white" />
                            <span>
                              {deletingFileId === file.id
                                ? "Deleting..."
                                : "Delete"}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Hidden download button for triggering download from dropdown */}
                      <div className="hidden">
                        <FileDownloadButton
                          fileId={file.id}
                          fileName={file.name}
                          fileSize={file.size}
                          variant="ghost"
                          size="icon"
                        >
                          <button id={`download-${file.id}`}>
                            <Download className="h-4 w-4" />
                          </button>
                        </FileDownloadButton>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
