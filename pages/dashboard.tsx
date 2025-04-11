import Dashboard from "@/components/dashboard/Dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import { UploadProvider } from "../contexts/UploadContext";

export default function DashboardPage() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      forcedTheme="dark"
    >
      <UploadProvider>
        <Dashboard />
      </UploadProvider>
    </ThemeProvider>
  );
}
