"use client"

import { useState } from "react"
import TopNav from "./TopNav"
import Sidebar from "./Sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <ScrollArea className="flex-1">
          <main className="flex-1 p-6">{children}</main>
        </ScrollArea>
      </div>
    </div>
  )
}

