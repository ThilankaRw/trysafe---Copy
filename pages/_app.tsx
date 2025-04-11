import { ThemeProvider } from "@/components/theme-provider";
import { EncryptionProvider } from "@/contexts/EncryptionContext";
import { Toaster } from "sonner";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
      <ThemeProvider>
        <EncryptionProvider>
          <Component {...pageProps} />
          <Toaster position="top-center" />
        </EncryptionProvider>
      </ThemeProvider>
  );
}
