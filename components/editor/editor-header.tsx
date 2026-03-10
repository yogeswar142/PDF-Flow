"use client"

import Link from "next/link"
import { FileText, Download, FilePlus, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EditorHeaderProps {
  fileName: string
  onNewFile: () => void
  pdfLoaded: boolean
  onDownload?: () => void
  isDownloading?: boolean
}

export function EditorHeader({ fileName, onNewFile, pdfLoaded, onDownload, isDownloading }: EditorHeaderProps) {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">PDF-Flow</span>
        </Link>

        {fileName && (
          <>
            <div className="w-px h-6 bg-border hidden sm:block" />
            <span className="text-sm text-muted-foreground truncate max-w-[200px] hidden sm:inline">
              {fileName}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {pdfLoaded && (
          <>
            <Button variant="ghost" size="sm" onClick={onNewFile}>
              <FilePlus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New</span>
            </Button>
            <Button size="sm" onClick={onDownload} disabled={isDownloading}>
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{isDownloading ? "Saving..." : "Download"}</span>
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
