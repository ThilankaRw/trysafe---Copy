"use client";

import { useState } from "react";
import {
  FileIcon,
  FolderIcon,
  MoreHorizontal,
  Share2,
  Grid,
  List,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { toast } from "sonner";
import { FileDownloadButton } from "./FileDownloadButton";

// Define the type for the file data (should match Dashboard.tsx)
type FileData = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  encrypted: boolean;
};

// Define props for FileGrid
interface FileGridProps {
  files: FileData[];
  onFileDelete: (fileId: string) => void;
}

// Explicitly type the component with React.FC
const FileGrid: React.FC<FileGridProps> = ({ files, onFileDelete }) => {
  const [view, setView] = useState<"grid" | "list">("grid");

  // Function to handle deletion from the menu
  const handleDelete = async (fileId: string, fileName: string) => {
    // Optional: Add a confirmation dialog here
    try {
      // Call the API to delete the file
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete file");
      }
      // Call the callback to update the parent state
      onFileDelete(fileId);
      toast.success(`File "${fileName}" deleted successfully.`);
    } catch (error: any) {
      console.error("Error deleting file:", error);
      toast.error(`Failed to delete file: ${error.message || "Unknown error"}`);
    }
  };

  // Display message if no files are present (using the prop)
  if (files.length === 0) {
    return (
      <div className="text-center p-8 mt-6">
        <p className="text-muted-foreground">No files uploaded yet.</p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Files
        </h2>
        <div className="space-x-2">
          {/* View toggle buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView("grid")}
            className={view === "grid" ? "bg-gray-200 dark:bg-gray-700" : ""}
          >
            <Grid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView("list")}
            className={view === "list" ? "bg-gray-200 dark:bg-gray-700" : ""}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Use the files PROP here */}
          {files.map((file) => (
            <FileCard key={file.id} file={file} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Use the files PROP here */}
          {files.map((file) => (
            <FileRow key={file.id} file={file} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FileGrid;

// --- FileCard Component ---
interface FileCardProps {
  file: FileData;
  onDelete: (fileId: string, fileName: string) => void;
}

function FileCard({ file, onDelete }: FileCardProps) {
  const isFolder = file.mimeType === "application/vnd.trysafe.folder"; // Example folder mime type

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm">
      {isFolder ? (
        <FolderIcon className="h-12 w-12 text-[rgb(31,111,130)] mx-auto mb-2" />
      ) : (
        <FileIcon className="h-12 w-12 text-[rgb(31,111,130)] mx-auto mb-2" />
      )}
      <p className="font-medium text-center truncate text-gray-700 dark:text-gray-300">
        {file.name}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {formatBytes(file.size)}
      </p>
      <div className="mt-2 flex justify-center space-x-2">
        <FileDownloadButton
          fileId={file.id}
          fileName={file.name}
          variant="ghost"
          size="icon"
          className="hover:bg-gray-200 dark:hover:bg-gray-600"
        />
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={() => toast.info("Sharing not implemented yet.")}
        >
          <Share2 className="h-4 w-4" />
        </Button>
        {/* Pass props to FileMenu */}
        <FileMenu fileId={file.id} fileName={file.name} onDelete={onDelete} />
      </div>
    </div>
  );
}

// --- FileRow Component ---
interface FileRowProps {
  file: FileData;
  onDelete: (fileId: string, fileName: string) => void;
}

function FileRow({ file, onDelete }: FileRowProps) {
  const isFolder = file.mimeType === "application/vnd.trysafe.folder";

  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        {isFolder ? (
          <FolderIcon className="h-6 w-6 text-[rgb(31,111,130)] flex-shrink-0" />
        ) : (
          <FileIcon className="h-6 w-6 text-[rgb(31,111,130)] flex-shrink-0" />
        )}
        <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
          {file.name}
        </span>
      </div>
      <div className="flex items-center space-x-4 flex-shrink-0">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatBytes(file.size)}
        </span>
        <FileDownloadButton
          fileId={file.id}
          fileName={file.name}
          variant="ghost"
          size="icon"
          className="hover:bg-gray-200 dark:hover:bg-gray-600"
        />
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={() => toast.info("Sharing not implemented yet.")}
        >
          <Share2 className="h-4 w-4" />
        </Button>
        {/* Pass props to FileMenu */}
        <FileMenu fileId={file.id} fileName={file.name} onDelete={onDelete} />
      </div>
    </div>
  );
}

// --- FileMenu Component ---
interface FileMenuProps {
  fileId: string;
  fileName: string;
  onDelete: (fileId: string, fileName: string) => void;
}

function FileMenu({ fileId, fileName, onDelete }: FileMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <FileDownloadButton
            fileId={fileId}
            fileName={fileName}
            variant="ghost"
            size="default"
            className="w-full justify-start px-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </FileDownloadButton>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toast.info("Rename not implemented yet.")}
        >
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toast.info("Move not implemented yet.")}
        >
          Move
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 dark:text-red-400 focus:text-red-700 focus:bg-red-100 dark:focus:text-red-300 dark:focus:bg-red-900/50"
          onClick={() => onDelete(fileId, fileName)} // Use the onDelete prop
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// --- Helper Function ---
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
