"use client"

import { useState, type MouseEvent } from "react"
import { motion } from "framer-motion"
import { Folder, File, ChevronRight } from "lucide-react"
import {FilePreview} from "./FilePreview"
import ShareModal from "./ShareModal"

const dummyFiles = [
  {
    name: "Documents",
    type: "folder",
    children: [
      { name: "Work", type: "folder" },
      { name: "Personal", type: "folder" },
    ],
  },
  { name: "Images", type: "folder" },
  { name: "report.pdf", type: "file" },
  { name: "presentation.pptx", type: "file" },
]

interface FileExplorerProps {
  currentFolder: string
  setCurrentFolder: (folder: string) => void
}

export default function FileExplorer({ currentFolder, setCurrentFolder }: FileExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: any } | null>(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [shareFile, setShareFile] = useState(null)

  const handleContextMenu = (e: MouseEvent, item: any) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    })
  }

  const closeContextMenu = () => {
    setContextMenu(null)
  }

  const handleFileClick = (file:any) => {
    setSelectedFile(file)
  }

  const handleShareClick = (file:any) => {
    setShareFile(file)
  }

  const renderTree = (items: any[]) => (
    <motion.ul className="pl-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {items.map((item) => (
        <motion.li
          key={item.name}
          className="py-1"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <button
            className="flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded w-full text-left group"
            onClick={() => (item.type === "folder" ? setCurrentFolder(item.name) : handleFileClick(item))}
            onContextMenu={(e) => handleContextMenu(e, item)}
          >
            {item.type === "folder" ? (
              <Folder className="w-5 h-5 mr-2 text-primary transition-all duration-300 group-hover:text-blue-400" />
            ) : (
              <File className="w-5 h-5 mr-2 text-gray-500 transition-all duration-300 group-hover:text-primary" />
            )}
            <span className="flex-1 truncate">{item.name}</span>
            {item.type === "folder" && item.children && (
              <ChevronRight className="w-4 h-4 ml-auto transition-transform duration-300 group-hover:rotate-90" />
            )}
          </button>
          {item.type === "file" && (
            <button className="ml-2 text-sm text-blue-500 hover:text-blue-600" onClick={() => handleShareClick(item)}>
              Share
            </button>
          )}
          {item.children && renderTree(item.children)}
        </motion.li>
      ))}
    </motion.ul>
  )

  return (
    <aside className="w-64 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-4 overflow-auto border-r border-gray-200 dark:border-gray-700">
      <nav>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
          <ChevronRight className="w-4 h-4 mr-1" />
          {currentFolder}
        </div>
        {renderTree(dummyFiles)}
      </nav>
      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} item={contextMenu.item} onClose={closeContextMenu} />
      )}
      {selectedFile && <FilePreview file={selectedFile} onClose={() => setSelectedFile(null)} />}
      {shareFile && <ShareModal fileName={shareFile.name} onClose={() => setShareFile(null)} />}
    </aside>
  )
}

interface ContextMenuProps {
  x: number
  y: number
  item: any
  onClose: () => void
}

function ContextMenu({ x, y, item, onClose }: ContextMenuProps) {
  const menuItems = [
    { label: "Rename", action: () => console.log("Rename", item.name) },
    { label: "Delete", action: () => console.log("Delete", item.name) },
    { label: "Download", action: () => console.log("Download", item.name) },
    { label: "Share", action: () => console.log("Share", item.name) },
  ]

  return (
    <motion.div
      className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 min-w-[150px] backdrop-blur-md bg-opacity-90 dark:bg-opacity-90"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
    >
      {menuItems.map((menuItem, index) => (
        <motion.button
          key={index}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-150"
          onClick={() => {
            menuItem.action()
            onClose()
          }}
          whileHover={{ x: 5 }}
        >
          {menuItem.label}
        </motion.button>
      ))}
    </motion.div>
  )
}

