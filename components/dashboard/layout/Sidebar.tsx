"use client"

import { motion } from "framer-motion"
import {
  Home,
  FolderOpen,
  Users,
  Clock,
  Trash2,
  Star,
  Cloud,
  Share2,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const sidebarItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FolderOpen, label: "My Drive", href: "/drive" },
  { icon: Users, label: "Shared with me", href: "/shared" },
  { icon: Clock, label: "Recent", href: "/recent" },
  { icon: Star, label: "Starred", href: "/starred" },
  { icon: Trash2, label: "Trash", href: "/trash" },
]

const bottomItems = [
  { icon: Cloud, label: "Storage", href: "/storage" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
]

export default function Sidebar({ open, onOpenChange }: SidebarProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        width: open ? 280 : 0,
      }}
      className={cn("relative border-r bg-background overflow-hidden", !open && "w-0")}
    >
      <ScrollArea className="h-screen">
        <div className="flex flex-col gap-2 p-4">
          <Button className="w-full justify-start gap-2" size="lg">
            <Share2 className="h-5 w-5" />
            New Share
          </Button>

          <nav className="grid gap-1 mt-4">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2",
                  item.href === "/drive" &&
                    "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {item.href === "/drive" && <ChevronRight className="ml-auto h-4 w-4" />}
              </Button>
            ))}
          </nav>

          <Separator className="my-4" />

          <nav className="grid gap-1">
            {bottomItems.map((item) => (
              <Button key={item.href} variant="ghost" className="w-full justify-start gap-2">
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="mt-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Storage</p>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[75%] rounded-full bg-primary" />
              </div>
              <p className="text-xs text-muted-foreground">75% of 100GB used</p>
            </div>
            <Button variant="link" className="mt-2 h-auto p-0 text-primary">
              Get more storage
            </Button>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  )
}

