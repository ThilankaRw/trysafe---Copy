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
      </UploadProvider>
    </ThemeProvider>
  );
}
