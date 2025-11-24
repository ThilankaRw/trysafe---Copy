import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import ThemeToggle from "../ThemeToggle";
import { UploadCloud, LayoutGrid, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TopNav() {
  return (
    <nav className="bg-white dark:bg-gray-900 p-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex-1 max-w-xl">
        <SearchBar />
      </div>
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-[rgb(31,111,130)] hover:bg-[rgb(31,111,130)]/10">
            <UploadCloud className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-[rgb(31,111,130)] hover:bg-[rgb(31,111,130)]/10">
            <LayoutGrid className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-[rgb(31,111,130)] hover:bg-[rgb(31,111,130)]/10 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </Button>
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
        <ThemeToggle />
        <UserMenu />
      </div>
    </nav>
  );
}
