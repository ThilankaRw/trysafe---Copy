"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Sun, Moon, Upload, User, ChevronRight } from "lucide-react"
import { useUpload } from "@/contexts/UploadContext"
import Image from "next/image"
import SearchBar from "./SearchBar"
import UserSettings from "./UserSettings"

interface TopBarProps {
  onUploadClick: () => void
}

export default function TopBar({ onUploadClick }: TopBarProps) {
  const { theme, setTheme } = useTheme()
  const { uploads } = useUpload()
  const [mounted, setMounted] = useState(false)
  const [showUserSettings, setShowUserSettings] = useState(false)

  useEffect(() => setMounted(true), [])

  const totalProgress = uploads.reduce((sum, upload) => sum + upload.progress, 0) / (uploads.length || 1)

  if (!mounted) return null

  return (
    <header className="flex items-center justify-between p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <Logo />
        <Breadcrumb />
      </div>

      <SearchBar />

      <div className="flex items-center space-x-4">
        <AnimatePresence>
          {uploads.length > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              onClick={onUploadClick}
              className="relative p-2 rounded-lg bg-gradient-to-br from-[#4ad1c5] to-[#2c82c9] text-white shadow-lg"
            >
              <Upload className="w-6 h-6" />
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#4ad1c5] to-[#2c82c9] opacity-50"
                  style={{
                    transform: `scaleX(${totalProgress / 100})`,
                    transformOrigin: "left",
                    transition: "transform 0.3s ease-out",
                  }}
                />
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        <ThemeToggle />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setShowUserSettings(true)}
        >
          <User className="w-6 h-6" />
        </motion.button>
      </div>
      {showUserSettings && <UserSettings onClose={() => setShowUserSettings(false)} />}
    </header>
  )
}

function Logo() {
  return (
    <motion.div
      className="flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="w-10 h-10 relative">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025-01-14_140644-removebg-hKhWiIOOKCMMt8FlbvaYB0D9aJRNwr.png"
          alt="Trisafe Logo"
          layout="fill"
          className="object-contain drop-shadow-lg"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          TRISAFE
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Secure Cloud Storage</span>
      </div>
    </motion.div>
  )
}

function Breadcrumb() {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
      <a href="#" className="hover:text-primary transition-colors">
        Home
      </a>
      <ChevronRight className="w-4 h-4" />
      <a href="#" className="hover:text-primary transition-colors">
        Documents
      </a>
      <ChevronRight className="w-4 h-4" />
      <span className="text-primary">Current Folder</span>
    </nav>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}

