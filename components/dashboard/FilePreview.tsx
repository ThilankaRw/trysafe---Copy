"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Share } from "lucide-react"
import { SecureFileStorage } from "@/lib/secure-storage"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface FilePreviewProps {
  file: {
    id: string;
    name: string;
    type: string;
    url?: string;
  }
  onClose: () => void
}

export default function FilePreview({ file, onClose }: FilePreviewProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for exit animation to complete
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      setDownloadProgress(0)

      // TODO: In production, use a proper key derivation from user's master key/password
      const password = "temporary-password" // This should come from user's master key

      const downloadedFile = await SecureFileStorage.downloadFile(
        file.id,
        password,
        (progress) => {
          setDownloadProgress(progress.percentage)
        }
      )

      // Create download URL and trigger download
      const downloadUrl = URL.createObjectURL(downloadedFile.data)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = downloadedFile.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)

      toast.success('File downloaded successfully')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download file')
    } finally {
      setIsDownloading(false)
      setDownloadProgress(0)
    }
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
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              {file.type.startsWith("image/") ? (
                <img src={file.url || "/placeholder.svg"} alt={file.name} className="max-w-full h-auto rounded" />
              ) : file.type === "application/pdf" ? (
                <embed src={file.url} type="application/pdf" width="100%" height="500px" />
              ) : (
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                  Preview not available for encrypted file.
                </div>
              )}
            </div>

            {isDownloading && (
              <div className="mb-4">
                <Progress value={downloadProgress} className="mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  Downloading and decrypting: {Math.round(downloadProgress)}%
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info('Sharing coming soon')}
                disabled={isDownloading}
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

