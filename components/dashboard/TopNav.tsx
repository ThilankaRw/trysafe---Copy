import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import ThemeToggle from "../ThemeToggle";
import { PasswordDialog } from "./passwordDialog";
import { useState } from "react";

export default function TopNav() {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const handlePasswordSubmit = (password: string) => {
    // Add your password validation logic here
    if (password === "your-password") {
      // Replace with actual validation
      setShowPasswordDialog(false);
      // Perform action after successful password entry
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
      <Logo />
      <div className="flex-1 max-w-2xl mx-4">
        <SearchBar />
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <UserMenu />
      </div>

      <PasswordDialog
        isOpen={showPasswordDialog}
        onPasswordSubmit={handlePasswordSubmit}
        title="Authentication Required"
        description="Please enter your password to continue"
      />
    </nav>
  );
}
