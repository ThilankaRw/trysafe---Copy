import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Share, Trash } from "lucide-react"

interface FilePreviewProps {
  file: {
    name: string
    type: string
    url: string
  }
  onClose: () => void
}

export default function FilePreview({ file, onClose }: FilePreviewProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for exit animation to complete
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-2xl w-full mx-4 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{file.name}</h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X />
              </button>
            </div>
            <div className="mb-4">
              {file.type.startsWith("image/") ? (
                <img src={file.url || "/placeholder.svg"} alt={file.name} className="max-w-full h-auto rounded" />
              ) : file.type === "application/pdf" ? (
                <embed src={file.url} type="application/pdf" width="100%" height="500px" />
              ) : (
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                  Preview not available for this file type.
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

