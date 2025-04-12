"use client";

import { useState } from "react";
import {
  FileIcon,
  FolderIcon,
  MoreHorizontal,
  Share2,
  Grid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const files = [
  { type: "folder", name: "Documents", modified: "2023-05-15", owner: "Me" },
  {
    type: "file",
    name: "Report.pdf",
    modified: "2023-05-14",
    owner: "John Doe",
  },
  {
    type: "file",
    name: "Presentation.pptx",
    modified: "2023-05-13",
    owner: "Me",
  },
  { type: "folder", name: "Images", modified: "2023-05-12", owner: "Me" },
  {
    type: "file",
    name: "Budget.xlsx",
    modified: "2023-05-11",
    owner: "Jane Smith",
  },
];

export default function FileGrid() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Files
        </h2>
        <div className="space-x-2">
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
          {files.map((file) => (
            <FileCard key={file.name} file={file} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <FileRow key={file.name} file={file} />
          ))}
        </div>
      )}
    </section>
  );
}

function FileCard({
  file,
}: {
  file: { type: string; name: string; modified: string; owner: string };
}) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm">
      {file.type === "folder" ? (
        <FolderIcon className="h-12 w-12 text-[rgb(31,111,130)] mx-auto mb-2" />
      ) : (
        <FileIcon className="h-12 w-12 text-[rgb(31,111,130)] mx-auto mb-2" />
      )}
      <p className="font-medium text-center truncate text-gray-700 dark:text-gray-300">
        {file.name}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {file.modified}
      </p>
      <div className="mt-2 flex justify-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <FileMenu />
      </div>
    </div>
  );
}

function FileRow({
  file,
}: {
  file: { type: string; name: string; modified: string; owner: string };
}) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
      <div className="flex items-center space-x-4">
        {file.type === "folder" ? (
          <FolderIcon className="h-6 w-6 text-[rgb(31,111,130)]" />
        ) : (
          <FileIcon className="h-6 w-6 text-[rgb(31,111,130)]" />
        )}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {file.name}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {file.modified}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {file.owner}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <FileMenu />
      </div>
    </div>
  );
}

function FileMenu() {
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
        <DropdownMenuItem>Download</DropdownMenuItem>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem>Move</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600 dark:text-red-400">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
