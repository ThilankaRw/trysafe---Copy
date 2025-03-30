import { useState } from "react"
import { motion } from "framer-motion"
import { X, Copy, Check } from "lucide-react"

interface ShareModalProps {
  fileName: string
  onClose: () => void
}

export default function ShareModal({ fileName, onClose }: ShareModalProps) {
  const [shareLink, setShareLink] = useState("https://trisafe.com/share/abc123")
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Share {fileName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X />
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="shareLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Share link
          </label>
          <div className="flex">
            <input
              type="text"
              id="shareLink"
              value={shareLink}
              readOnly
              className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 bg-primary text-white rounded-r-md hover:bg-primary-dark transition-colors duration-200"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

