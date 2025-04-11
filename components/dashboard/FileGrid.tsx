"use client"

import { useState } from "react"
import { Card } from "../ui/card"
import { FilePreview } from "./FilePreview"
import { PassphrasePrompt } from "../secure-storage/PassphrasePrompt"
import { toast } from "sonner"

interface FileGridProps {
  files: Array<{
    id: string
    name: string
    mimeType: string
    size: number
    encrypted: boolean
  }>
  onFileDelete?: (fileId: string) => void
}

export function FileGrid({ files, onFileDelete }: FileGridProps) {
  const [selectedFile, setSelectedFile] = useState<{
    id: string
    name: string
    mimeType: string
    encrypted: boolean
  } | null>(null)
  const [showPassphrasePrompt, setShowPassphrasePrompt] = useState(false)
  const [encryptionParams, setEncryptionParams] = useState(null)
  const [isDecrypting, setIsDecrypting] = useState(false)

  const handleFileClick = async (file: typeof files[0]) => {
    if (!file.encrypted) {
      setSelectedFile(file)
      return
    }

    try {
      const response = await fetch("/api/auth/encryption-params")
      if (!response.ok) {
        throw new Error("Failed to fetch encryption parameters")
      }

      const params = await response.json()
      setEncryptionParams(params)
      setSelectedFile(file)
      setShowPassphrasePrompt(true)
    } catch (error) {
      console.error("Failed to prepare file decryption:", error)
      toast.error("Failed to prepare file decryption")
    }
  }

  const handlePassphraseEntered = async (passphrase: string) => {
    if (!selectedFile) return

    setIsDecrypting(true)
    try {
      const response = await fetch(`/api/files/download/${selectedFile.id}`)
      if (!response.ok) {
        throw new Error("Failed to download file")
      }

      const fileData = await response.blob()
      if (
        selectedFile.mimeType.startsWith("image/") ||
        selectedFile.mimeType === "application/pdf"
      ) {
        const url = URL.createObjectURL(fileData)
        setSelectedFile({
          ...selectedFile,
          previewUrl: url,
        })
      } else {
        const a = document.createElement("a")
        a.href = URL.createObjectURL(fileData)
        a.download = selectedFile.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Decryption failed:", error)
      toast.error("Failed to decrypt file")
    } finally {
      setIsDecrypting(false)
      setShowPassphrasePrompt(false)
    }
  }

  if (files.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No files found</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {files.map((file) => (
          <Card
            key={file.id}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleFileClick(file)}
          >
            <FilePreview file={file} />
          </Card>
        ))}
      </div>

      {selectedFile && encryptionParams && (
        <PassphrasePrompt
          isOpen={showPassphrasePrompt}
          onClose={() => {
            setShowPassphrasePrompt(false)
            setSelectedFile(null)
          }}
          onPassphraseEntered={handlePassphraseEntered}
          encryptionParams={encryptionParams}
          title={`Decrypt ${selectedFile.name}`}
          description="Enter your encryption passphrase to access this file"
        />
      )}
    </>
  )
}

