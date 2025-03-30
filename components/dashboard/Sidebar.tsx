import { Home, FolderOpen, Users, Clock, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const sidebarItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FolderOpen, label: "My Drive", href: "/drive" },
  { icon: Users, label: "Shared", href: "/shared" },
  { icon: Clock, label: "Recent", href: "/recent" },
  { icon: Trash, label: "Trash", href: "/trash" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 p-4 hidden md:block border-r border-gray-200 dark:border-gray-800">
      <nav className="space-y-1">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              "w-full justify-start hover:bg-gray-100 dark:hover:bg-gray-800",
              pathname === item.href && "bg-gray-100 dark:bg-gray-800 text-[rgb(31,111,130)]",
            )}
            asChild
          >
            <a href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </a>
          </Button>
        ))}
      </nav>
    </aside>
  )
}

