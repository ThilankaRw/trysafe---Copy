import Dashboard from "@/components/dashboard/Dashboard";
import { ThemeProvider } from "@/components/theme-provider";

export default function DashboardPage() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={true}
      forcedTheme="dark"
    >
      <Dashboard />
    </ThemeProvider>
  );
}
