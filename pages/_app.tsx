import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { UploadProvider } from "@/contexts/UploadContext";
import "../styles/globals.css";
import { useEffect } from "react";
import { useSecureStore } from "@/store/useSecureStore";

export default function App({ Component, pageProps }: AppProps) {

    const { initializeStorage, reinitializeStorage, isInitialized } = useSecureStore();

  useEffect(() => {
    // if(!isInitialized){
      initializeStorage("password")
      console.log("Secure storage initialized",{
        isInitialized
      });
    // }
   
  }, []);
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
