"use client"

import { useCallback, useState } from "react"
import { Upload, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadOverlayProps {
  onFileUpload: (file: File) => void
}

export function UploadOverlay({ onFileUpload }: UploadOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && file.type === "application/pdf") {
        onFileUpload(file)
      }
    },
    [onFileUpload]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onFileUpload(file)
      }
    },
    [onFileUpload]
  )

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div
        className={cn(
          "w-full max-w-2xl aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300",
          "flex flex-col items-center justify-center gap-6 p-8",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center transition-colors",
            isDragging ? "bg-primary/10" : "bg-muted"
          )}
        >
          {isDragging ? (
            <FileText className="h-10 w-10 text-primary" />
          ) : (
            <Upload className="h-10 w-10 text-muted-foreground" />
          )}
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {isDragging ? "Drop your PDF here" : "Upload your PDF"}
          </h2>
          <p className="text-muted-foreground">
            Drag and drop a PDF file, or click to browse
          </p>
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="sr-only"
          />
          <span className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            Choose File
          </span>
        </label>

        <p className="text-xs text-muted-foreground">
          Your files are processed locally and never uploaded to any server
        </p>
      </div>
    </div>
  )
}
