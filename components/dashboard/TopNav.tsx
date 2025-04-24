import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import ThemeToggle from "../ThemeToggle";
import { PasswordDialog } from "./passwordDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface TopNavProps {
  onShowUploads?: () => void;
}

export default function TopNav({ onShowUploads }: TopNavProps) {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
      <Logo />
      <div className="flex-1 max-w-2xl mx-4">
        <SearchBar />
      </div>
      <div className="flex items-center space-x-4">
        {onShowUploads && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowUploads}
            title="Show uploads"
          >
            <Upload className="h-5 w-5" />
          </Button>
        )}
        <ThemeToggle />
        <UserMenu />
      </div>
    </nav>
  );
}
