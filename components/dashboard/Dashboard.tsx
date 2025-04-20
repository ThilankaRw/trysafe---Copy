"use client";

import { useState, useEffect } from "react";
// import { useSession } from 'next-auth/react'; // Previous incorrect assumption

// --- PLACEHOLDER: Import the hook from your actual auth library ---
// import { useBetterAuth } from '@/lib/better-auth'; // Example placeholder
// -------------------------------------------------------------------

import { useSecureStore } from "@/store/useSecureStore";
import { toast } from "sonner";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Footer from "./Footer";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { PassphrasePrompt } from "../secure-storage/PassphrasePrompt";
import UploadPopup from "./UploadPopup";
import { useUpload } from "@/contexts/UploadContext";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import TransferPanel from "./TransferPanel";

// Define a type for the file data (adjust based on your actual API response)
type FileData = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  encrypted: boolean;
};

export default function Dashboard() {
  // --- PLACEHOLDER: Use your actual auth hook here ---
  // const { isAuthenticated, isLoading: isAuthLoading } = useBetterAuth(); // Example placeholder
  const isAuthenticated = true; // TEMPORARY: Assume authenticated for structure
  const isAuthLoading = false; // TEMPORARY: Assume auth check is done
  // ----------------------------------------------------

  const { isInitialized, reinitializeStorage } = useSecureStore();
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true); // Renamed for clarity
  const [showReinitPrompt, setShowReinitPrompt] = useState(false);
  const [isReinitializing, setIsReinitializing] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const { uploads } = useUpload();

  // Effect to check if re-initialization prompt is needed
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
      // Handle case where user is somehow not authenticated but on dashboard?
      // Maybe redirect to login?
      console.warn("[Dashboard] User is not authenticated.");
    } else if (isAuthenticated && isInitialized) {
      // Already initialized, prompt shouldn't be shown
      setShowReinitPrompt(false);
    }
  }, [isAuthenticated, isAuthLoading, isInitialized]);

  // Effect to fetch files - runs only when isInitialized becomes true
  useEffect(() => {
    console.log(
      `[Dashboard] File fetch check: isInitialized = ${isInitialized}`
    );
    if (!isInitialized) {
      // We might be showing the prompt, or auth hasn't finished, wait.
      setIsLoadingFiles(false); // Ensure loading state is off if we skip fetch
      return;
    }
    console.log("[Dashboard] Fetching files...");

    const fetchFiles = async () => {
      setIsLoadingFiles(true);
      try {
        const response = await fetch("/api/files");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Failed to fetch files (status: ${response.status})`
          );
        }
        const data = await response.json();
        setFiles(data.files || []);
      } catch (error: any) {
        console.error("Error fetching files:", error);
        toast.error(`Could not load your files: ${error.message}`);
        setFiles([]);
      } finally {
        setIsLoadingFiles(false);
      }
    };

    fetchFiles();
  }, [isInitialized]); // Dependency: This effect runs when isInitialized changes

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
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav onShowUploads={() => setShowUploadPopup(true)} />
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
        <Footer />
      </div>

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

      {/* Upload Popup */}
      {showUploadPopup && (
        <UploadPopup onClose={() => setShowUploadPopup(false)} />
      )}

      {/* Transfer Panel for upload/download indicators */}
      <TransferPanel />
    </div>
  );
}
