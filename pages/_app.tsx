import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { UploadProvider } from "@/contexts/UploadContext";
import "../styles/globals.css";
import { useEffect, useState } from "react";
import { useSecureStore } from "@/store/useSecureStore";
import { authClient } from "@/lib/auth-client";
import { PasswordDialog } from "@/components/dashboard/passwordDialog";

export default function App({ Component, pageProps }: AppProps) {
  const { data: session } = authClient.useSession();
  const { isInitialized, initializeStorage, reinitializeStorage } =
    useSecureStore();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    console.log("Session:", session);
    console.log("Is Initialized:", isInitialized);
    if (session) {
      // Check if the session is valid and the user is authenticated
      if (!isInitialized) {
        setShowPasswordDialog(true);
        console.log("Session is valid, but storage is not initialized.");
      } else {
        // If there's no session, redirect to login or show login dialog
        // You can use router.push('/login') if you have a login page
        setShowPasswordDialog(false);
        console.log("No session found, showing password dialog.");
      }
    }
  }, [session, isInitialized]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <UploadProvider>
        <Component {...pageProps} />
        <Toaster richColors />

        <PasswordDialog
          isOpen={showPasswordDialog}
          onPasswordSubmit={(password: string) => {
            setShowPasswordDialog(false);
            // Add your password validation logic here
            if (isInitialized) {
              reinitializeStorage(password);
            } else {
              initializeStorage(password);
            }
          }}
          title="Authentication Required"
          description="Please enter your password to continue"
        />
      </UploadProvider>
    </ThemeProvider>
  );
}
