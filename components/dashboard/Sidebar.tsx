import { Folder, Clock, Share2, Star, Trash2, ChevronDown, FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useRef } from "react";
import { useFileUploader } from "@/hooks/useFileUploader";

const sidebarItems = [
  { icon: FolderOpen, label: "My Files", href: "/", isActive: true },
  { icon: Clock, label: "Recent Files", href: "/recent" },
  { icon: Share2, label: "Shared With Me", href: "/shared" },
  { icon: Star, label: "Favorites", href: "/favorites" },
  { icon: Trash2, label: "Trash", href: "/trash" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleUpload } = useFileUploader();

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(Array.from(e.target.files));
      // Reset input
      e.target.value = "";
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 flex flex-col h-screen border-r border-gray-200 dark:border-gray-800">
      <div className="p-6 pb-4">
        <Logo />
        <div className="mt-6">
           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             multiple 
             onChange={onFileSelect} 
           />
           <Button 
             className="w-full bg-[rgb(31,111,130)] hover:bg-[rgb(25,90,105)] text-white shadow-lg shadow-[rgb(31,111,130)]/20 rounded-full py-6 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
             onClick={() => fileInputRef.current?.click()}
           >
             <Plus className="w-5 h-5" />
             <span className="font-semibold text-base">Upload New</span>
           </Button>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              "w-full justify-start py-6 rounded-xl transition-all duration-200",
              // Use isActive property or pathname check
              (item.isActive && pathname === "/") || pathname === item.href
                ? "bg-[rgb(31,111,130)]/10 text-[rgb(31,111,130)] font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            asChild
          >
            <a href={item.href} className="flex items-center gap-3">
              <item.icon className={cn("h-5 w-5", 
                 (item.isActive && pathname === "/") || pathname === item.href ? "text-[rgb(31,111,130)]" : "text-gray-500"
              )} />
              <span className="text-sm">{item.label}</span>
            </a>
          </Button>
        ))}

        <Button
            variant="ghost"
            className="w-full justify-start py-6 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 mt-2"
        >
             <div className="flex items-center gap-3 w-full">
                <ChevronDown className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium">More</span>
             </div>
        </Button>
      </nav>
    </aside>
  );
}
