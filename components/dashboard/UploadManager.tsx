"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Pause, Play, Trash2 } from "lucide-react"
import { useUpload } from "@/contexts/UploadContext"

interface UploadManagerProps {
  isOpen: boolean
  onClose: () => void
}

export default function UploadManager({ isOpen, onClose }: UploadManagerProps) {
  const { uploads, removeUpload } = useUpload()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Ongoing Uploads</h2>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}>
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            <ul className="space-y-4">
              {uploads.map((upload) => (
                <motion.li
                  key={upload.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center"
                >
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{upload.name}</span>
                      <span className="text-sm text-gray-500">{upload.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-primary to-blue-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${upload.progress}%` }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {upload.status === "paused" ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => removeUpload(upload.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

