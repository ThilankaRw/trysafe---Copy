import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import ThemeToggle from "../ThemeToggle";

export default function TopNav() {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
      <Logo />
      <div className="flex-1 max-w-2xl mx-4">
        <SearchBar />
      </div>
      <div className="flex items-center space-x-4">
        <UserMenu />
        <ThemeToggle />
      </div>
    </nav>
  );
}
