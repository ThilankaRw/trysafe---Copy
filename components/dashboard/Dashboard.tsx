"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { useSecureStore } from "@/store/useSecureStore";
import { toast } from "sonner";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import RightPanel from "./RightPanel";
import TransferManager from "./TransferManager";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { PassphrasePrompt } from "../secure-storage/PassphrasePrompt";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import { useDropzone } from "react-dropzone";
import { useFileUploader } from "@/hooks/useFileUploader";
import GlobalDropzone from "./GlobalDropzone";

// Define a type for the file data (adjust based on your actual API response)
type FileData = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  encrypted: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function DashboardInner() {
  // Use the lightweight client auth hook to determine session state
  const { data: session, isPending: isAuthLoading } = authClient.useSession();
  const isAuthenticated = !!session?.user;

  const { isInitialized, reinitializeStorage } = useSecureStore();
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true); // Renamed for clarity
  const [showReinitPrompt, setShowReinitPrompt] = useState(false);
  const [isReinitializing, setIsReinitializing] = useState(false);
  const { setRefreshCallback } = useDashboard();
  
  // File Upload Hook
  const { handleUpload } = useFileUploader();

  // Global Dropzone Config
  const onDrop = useCallback((acceptedFiles: File[]) => {
      handleUpload(acceptedFiles);
  }, [handleUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      noClick: true,
      noKeyboard: true,
      disabled: !isAuthenticated || !isInitialized,
  });

  useEffect(() => {
    console.log(
      `[Dashboard] Reinit check: isAuthLoading=${isAuthLoading}, isAuthenticated=${isAuthenticated}, isInitialized=${isInitialized}`
    );
    // Don't check until authentication status is resolved
    if (isAuthLoading) return;

    if (isAuthenticated && !isInitialized) {
      console.log(
        "[Dashboard] Conditions met: Showing reinitialization prompt."
      );
      setShowReinitPrompt(true);
    } else if (!isAuthenticated) {
      console.warn("[Dashboard] User is not authenticated.");
    } else if (isAuthenticated && isInitialized) {
      setShowReinitPrompt(false);
    }
  }, [isAuthenticated, isAuthLoading, isInitialized]);

  // Fetch files function - can be called anytime to refresh
  const fetchFiles = useCallback(async () => {
    if (!isInitialized) {
      setIsLoadingFiles(false);
      return;
    }

    console.log("[Dashboard] Fetching files...");
    setIsLoadingFiles(true);
    try {
      const response = await fetch("/api/files", {
        cache: "no-store", // Ensure fresh data
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch files (status: ${response.status})`
        );
      }
      const data = await response.json();
      setFiles(data.files || []);
      console.log(`[Dashboard] Loaded ${data.files?.length || 0} files`);
    } catch (error: any) {
      console.error("Error fetching files:", error);
      toast.error(`Could not load your files: ${error.message}`);
      setFiles([]);
    } finally {
      setIsLoadingFiles(false);
    }
  }, [isInitialized]);

  // Register refresh callback with context
  useEffect(() => {
    setRefreshCallback(fetchFiles);
  }, [fetchFiles, setRefreshCallback]);

  // Effect to fetch files - runs only when isInitialized becomes true
  useEffect(() => {
    console.log(
      `[Dashboard] File fetch check: isInitialized = ${isInitialized}`
    );
    if (isInitialized) {
      fetchFiles();
    }
  }, [isInitialized, fetchFiles]); // Dependency: This effect runs when isInitialized changes

  // Function to handle file deletion (passed down to update state)
  const handleFileDelete = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    // The actual API call is now handled within FileGrid's handleDelete
  };

  // Handler for the re-initialization prompt
  const handleReinitPassphrase = async (password: string) => {
    setIsReinitializing(true);
    try {
      await reinitializeStorage(password);
      toast.success("Secure storage unlocked.");
      setShowReinitPrompt(false); // Close prompt on success
      // isInitialized state change will trigger the file fetch effect
    } catch (error) {
      console.error("Failed to re-initialize secure storage:", error);
      toast.error("Incorrect passphrase. Please try again.");
      // Consider adding attempt limits if desired
    } finally {
      setIsReinitializing(false);
    }
  };

  // Render loading state while checking auth or waiting for initialization prompt
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading session...</p> {/* Or a spinner */}
      </div>
    );
  }

  // If user is definitely not authenticated (after loading), maybe redirect?
  // This depends on your app's routing logic.
  // if (!isAuthenticated) { return <p>Redirecting to login...</p>; }

  return (
    <div {...getRootProps()} className="h-screen bg-background text-foreground flex overflow-hidden relative outline-none">
      <input {...getInputProps()} />
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopNav />
        <div className="flex-1 flex overflow-hidden relative">
            {/* Render MainContent only if initialized, otherwise show placeholder/loader */}
            {isAuthenticated && isInitialized ? (
              <MainContent
                files={files}
                isLoading={isLoadingFiles}
                onFileDelete={handleFileDelete}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                {/* Show message while waiting for prompt/initialization, hide if prompt is shown */}
                {!showReinitPrompt && isAuthenticated && <p>Please wait...</p>}
                {!isAuthenticated && <p>Error: Not authenticated.</p>}
              </div>
            )}
            <RightPanel />
        </div>
      </div>

      {/* Global Dropzone Overlay */}
      <GlobalDropzone isDragActive={isDragActive} />

      {/* Re-initialization Passphrase Prompt (Rendered conditionally by state) */}
      <PassphrasePrompt
        isOpen={showReinitPrompt}
        isProcessing={isReinitializing}
        onClose={() => {
          // Decide if user should be allowed to close without unlocking
          // Maybe show a persistent warning or limit functionality?
          // For now, let's prevent closing easily, they need to unlock.
          toast.info("Please enter your passphrase to continue.");
        }}
        onPassphraseEntered={handleReinitPassphrase}
        title="Unlock Secure Storage"
        description="Please enter your master passphrase to access your encrypted data for this session."
        // encryptionParams not needed for re-initialization
      />

      {/* Transfer Manager - Floating button and panel */}
      <TransferManager />
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardInner />
    </DashboardProvider>
  );
}
