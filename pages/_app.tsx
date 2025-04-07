import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/components/theme-provider";
import { SecureStorageProvider } from "@/contexts/SecureStorageContext";
import { UploadProvider } from "@/contexts/UploadContext";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SecureStorageProvider>
        <UploadProvider>
          <Component {...pageProps} />
          <Toaster position="bottom-right" />
        </UploadProvider>
      </SecureStorageProvider>
    </ThemeProvider>
  );
}
