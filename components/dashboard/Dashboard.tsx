"use client";

import { useState, useEffect } from "react";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Footer from "./Footer";
import { toast } from "sonner";

// Define a type for the file data (adjust based on your actual API response)
type FileData = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  encrypted: boolean;
};

export default function Dashboard() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/files"); // Assuming this endpoint exists
        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }
        const data = await response.json();
        setFiles(data.files || []); // Adjust based on API response structure
      } catch (error) {
        console.error("Error fetching files:", error);
        toast.error("Could not load your files.");
        setFiles([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []); // Empty dependency array means run once on mount

  // Function to handle file deletion (to update state if FileGrid needs it)
  const handleFileDelete = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    // Optionally call an API to delete the file on the server
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <MainContent
          files={files}
          isLoading={isLoading}
          onFileDelete={handleFileDelete}
        />
        <Footer />
      </div>
    </div>
  );
}
