"use client"

import { useState, useCallback } from "react"
import { EditorHeader } from "./editor-header"
import { PageSidebar } from "./page-sidebar"
import { CanvasArea } from "./canvas-area"
import { FloatingToolbar } from "./floating-toolbar"
import { UploadOverlay } from "./upload-overlay"

import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export type Tool = "select" | "text" | "delete" | "move"

export interface PDFPage {
  id: number
  thumbnail?: string
}

export interface TextAnnotation {
  id: string
  page: number
  pageScale: number
  x: number
  y: number
  text: string
  originalText?: string
  width?: number
  height?: number
  fontSize?: number
  color?: string
  isBold?: boolean
  isItalic?: boolean
}

export function EditorWorkspace() {
  const [pdfLoaded, setPdfLoaded] = useState(false)
  const [pages, setPages] = useState<PDFPage[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTool, setActiveTool] = useState<Tool>("select")
  const [fileName, setFileName] = useState("")
  
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null)
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([])
  
  const [isDownloading, setIsDownloading] = useState(false)

  const handleFileUpload = useCallback(async (file: File) => {
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = async () => {
      const buffer = reader.result as ArrayBuffer
      console.log(`Loaded PDF ArrayBuffer: ${buffer.byteLength} bytes`)
      setPdfBuffer(buffer)
      
      try {
        const doc = await PDFDocument.load(buffer.slice(0), { ignoreEncryption: true })
        const pageCount = doc.getPageCount()
        const newPages = Array.from({ length: pageCount }).map((_, i) => ({ id: i + 1 }))
        setPages(newPages)
      } catch (e) {
        console.error("Failed to parse PDF for page count", e)
        setPages([{ id: 1 }])
      }
      
      setPdfLoaded(true)
      setCurrentPage(1)
      setAnnotations([])
    }
    reader.readAsArrayBuffer(file)
  }, [])

  const handleNewFile = useCallback(() => {
    setPdfLoaded(false)
    setPdfBuffer(null)
    setAnnotations([])
    setPages([])
    setCurrentPage(1)
    setFileName("")
    setActiveTool("select")
  }, [])

  const handleDownload = async () => {
    if (!pdfBuffer) return
    try {
      setIsDownloading(true)
      const pdfDoc = await PDFDocument.load(pdfBuffer.slice(0))
      const pdfPages = pdfDoc.getPages()
      
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const helveticaItalicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)
      const helveticaBoldItalicFont = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique)

      const parseColor = (hex: string = '#000000') => {
        const r = parseInt(hex.slice(1, 3), 16) / 255
        const g = parseInt(hex.slice(3, 5), 16) / 255
        const b = parseInt(hex.slice(5, 7), 16) / 255
        return rgb(r, g, b)
      }
      
      // Apply annotations
      for (const ann of annotations) {
        if (!ann.width || !ann.height) continue
        
        // Find the specific page for this annotation (ann.page is 1-indexed)
        const pageIndex = ann.page - 1
        if (pageIndex < 0 || pageIndex >= pdfPages.length) continue
        
        const targetPage = pdfPages[pageIndex]
        const { height: pageHeight } = targetPage.getSize()

        // Reverse the canvas scale to get the original PDF coordinates
        const scale = ann.pageScale || 1;
        const unscaledX = ann.x / scale;
        const unscaledY = ann.y / scale;
        const unscaledW = ann.width / scale;
        const unscaledH = ann.height / scale;
        const unscaledFontSize = (ann.fontSize || 12) / scale;

        // 1. Draw a whiteout rectangle over the original text
        // Note: pdf-lib uses bottom-left as (0,0). Our unscaledY is Canvas Y (top-left).
        const yPdf = pageHeight - unscaledY

        targetPage.drawRectangle({
          x: unscaledX,
          y: yPdf - unscaledH, 
          width: unscaledW,
          height: unscaledH + (2 / scale), // slightly bleed
          color: rgb(1, 1, 1),
        })

        const font = ann.isBold && ann.isItalic ? helveticaBoldItalicFont :
                     ann.isBold ? helveticaBoldFont :
                     ann.isItalic ? helveticaItalicFont :
                     helveticaFont;

        // 2. Draw new text over the whiteout
        targetPage.drawText(ann.text, {
          x: unscaledX,
          y: yPdf - unscaledH + (2 / scale), // Offset slightly to align baseline
          size: unscaledFontSize,
          font: font,
          color: parseColor(ann.color),
        })
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `edited-${fileName}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to save PDF", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-muted/30 overflow-hidden">
      <EditorHeader 
        fileName={fileName} 
        onNewFile={handleNewFile} 
        pdfLoaded={pdfLoaded} 
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />
      
      {!pdfLoaded ? (
        <UploadOverlay onFileUpload={handleFileUpload} />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <PageSidebar
            pages={pages}
            currentPage={currentPage}
            onPageSelect={setCurrentPage}
          />
          <div className="flex-1 relative flex flex-col h-full overflow-hidden">
            <FloatingToolbar activeTool={activeTool} onToolChange={setActiveTool} />
            {pdfBuffer && (
              <CanvasArea 
                currentPage={currentPage} 
                activeTool={activeTool} 
                setActiveTool={setActiveTool}
                pdfBuffer={pdfBuffer}
                annotations={annotations}
                setAnnotations={setAnnotations}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
