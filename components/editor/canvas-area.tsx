"use client"

import { useState, useEffect, useRef } from "react"
import type { Tool, TextAnnotation } from "./editor-workspace"
import { cn } from "@/lib/utils"
import * as pdfjsLib from "pdfjs-dist"
import { Check, Trash2 } from "lucide-react"

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`

interface CanvasAreaProps {
  currentPage: number
  activeTool: Tool
  setActiveTool: (tool: Tool) => void
  pdfBuffer: ArrayBuffer
  annotations: TextAnnotation[]
  setAnnotations: (ann: TextAnnotation[]) => void
}

interface ExtractedText {
  str: string
  x: number
  y: number
  width: number
  height: number
}

export function CanvasArea({ currentPage, activeTool, setActiveTool, pdfBuffer, annotations, setAnnotations }: CanvasAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [extractedTexts, setExtractedTexts] = useState<ExtractedText[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const editingContextRef = useRef<{ id: string, original: TextAnnotation, isNew: boolean } | null>(null)
  const [scale, setScale] = useState(1)

  // Selection-box drag state
  const [selBox, setSelBox] = useState<{ sx: number; sy: number; cx: number; cy: number } | null>(null)
  // Move drag state
  const movingRef = useRef<{ id: string; lastX: number; lastY: number } | null>(null)

  const startEditing = (ann: TextAnnotation, isNew: boolean = false) => {
    editingContextRef.current = { id: ann.id, original: { ...ann }, isNew }
    setTimeout(() => setEditingId(ann.id), 0)
  }

  const cancelEditing = () => {
    setEditingId((currentEditingId) => {
      const ctx = editingContextRef.current
      if (currentEditingId && ctx) {
        setAnnotations((prev) => {
          if (ctx.isNew) return prev.filter((a) => a.id !== currentEditingId)
          return prev.map((a) => (a.id === currentEditingId ? ctx.original : a))
        })
      }
      return null
    })
    editingContextRef.current = null
  }

  const completeEditing = () => {
    setEditingId(null)
    editingContextRef.current = null
    setAnnotations((prev) => prev.filter((a) => a.text.trim() !== ""))
    setActiveTool("select")
  }

  // Escape to undo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelEditing()
        setSelBox(null)
        movingRef.current = null
        setActiveTool("select")
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [setAnnotations, setActiveTool])

  // Render PDF page on canvas
  useEffect(() => {
    let renderTask: any = null
    let cancelled = false

    const render = async () => {
      if (!canvasRef.current || !containerRef.current) return
      try {
        const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer.slice(0) })
        const pdf = await loadingTask.promise
        if (cancelled) return
        const page = await pdf.getPage(currentPage)
        if (cancelled) return

        const containerWidth = Math.min(containerRef.current.clientWidth - 32, 1000)
        const rawViewport = page.getViewport({ scale: 1 })
        const sc = containerWidth / rawViewport.width
        setScale(sc)

        const viewport = page.getViewport({ scale: sc })
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx || cancelled) return

        canvas.width = viewport.width
        canvas.height = viewport.height

        renderTask = page.render({ canvasContext: ctx, viewport })
        await renderTask.promise

        // Extract text items mapped to canvas coordinates
        const textContent = await page.getTextContent()
        const items: ExtractedText[] = (textContent.items as any[]).map((item) => {
          const tx = pdfjsLib.Util.transform(viewport.transform, item.transform)
          return {
            str: item.str,
            x: tx[4],
            y: tx[5] - item.height * sc,
            width: item.width * sc,
            height: item.height * sc,
          }
        })
        console.log(`Extracted ${items.length} text items`, items)
        setExtractedTexts(items)
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") console.error(err)
      }
    }

    render()
    return () => {
      cancelled = true
      renderTask?.cancel?.()
    }
  }, [pdfBuffer, currentPage])

  // ── Helpers ─────────────────────────────────────────────────────────────
  const findClosestText = (x: number, y: number, threshold = 60): ExtractedText | null => {
    let best: ExtractedText | null = null
    let bestDist = Infinity
    for (const t of extractedTexts) {
      if (!t.str.trim()) continue
      const cx = t.x + t.width / 2
      const cy = t.y + t.height / 2
      const d = Math.hypot(cx - x, cy - y)
      if (d < bestDist) { bestDist = d; best = t }
    }
    return bestDist < threshold ? best : null
  }

  const annotationAt = (x: number, y: number): TextAnnotation | null => {
    for (const a of annotations) {
      if (a.page !== currentPage) continue
      const w = a.width || 120
      const h = a.height || 20
      if (x >= a.x && x <= a.x + w && y >= a.y && y <= a.y + h) return a
    }
    return null
  }

  const makeAnnotationFromText = (t: ExtractedText): TextAnnotation => ({
    id: `ann-${Date.now()}-${Math.random()}`,
    page: currentPage,
    pageScale: scale,
    x: t.x, y: t.y,
    width: Math.max(t.width, 60),
    height: t.height,
    text: t.str,
    originalText: t.str,
    fontSize: Math.max(t.height - 4, 10),
    color: "#000000",
    isBold: false,
    isItalic: false,
  })

  const makeBlankAnnotation = (x: number, y: number): TextAnnotation => ({
    id: `ann-${Date.now()}-${Math.random()}`,
    page: currentPage,
    pageScale: scale,
    x, y,
    width: 150, height: 20,
    text: "",
    fontSize: 14,
    color: "#000000",
    isBold: false,
    isItalic: false,
  })

  const updateAnnotation = (id: string, updates: Partial<TextAnnotation>) =>
    setAnnotations(annotations.map(a => a.id === id ? { ...a, ...updates } : a))

  // ── Pointer handlers on the container ───────────────────────────────────
  const handleContainerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only handle clicks on canvas/background — not on annotation children
    // (annotation children call stopPropagation)
    if (e.target !== canvasRef.current && e.target !== e.currentTarget) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Click on empty space always closes editing and saves
    completeEditing()

    if (activeTool === "select") {
      setSelBox({ sx: x, sy: y, cx: x, cy: y })
    } else if (activeTool === "text") {
      // Check if there's already an annotation at this spot — open it for editing
      const existing = annotationAt(x, y)
      if (existing) {
        startEditing(existing, false)
        return
      }
      // Create new annotation (snapping to closest PDF text if near one)
      const closest = findClosestText(x, y)
      const ann = closest ? makeAnnotationFromText(closest) : makeBlankAnnotation(x, y)
      setAnnotations([...annotations, ann])
      startEditing(ann, true)
    }
  }

  const handleContainerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeTool === "select" && selBox) {
      const rect = e.currentTarget.getBoundingClientRect()
      setSelBox({ ...selBox, cx: e.clientX - rect.left, cy: e.clientY - rect.top })
    } else if (activeTool === "move" && movingRef.current) {
      const { id, lastX, lastY } = movingRef.current
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      movingRef.current = { id, lastX: e.clientX, lastY: e.clientY }
      setAnnotations(annotations.map(a => a.id === id ? { ...a, x: a.x + dx, y: a.y + dy } : a))
    }
  }

  const handleContainerPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeTool === "move" && movingRef.current) {
      movingRef.current = null
    }
    if (activeTool === "select" && selBox) {
      const box = { ...selBox }
      setSelBox(null)
      const minX = Math.min(box.sx, box.cx)
      const maxX = Math.max(box.sx, box.cx)
      const minY = Math.min(box.sy, box.cy)
      const maxY = Math.max(box.sy, box.cy)

      // If tiny drag (just a click), open closest annotation
      if (maxX - minX < 5 || maxY - minY < 5) {
        const closest = findClosestText(box.sx, box.sy, 50)
        if (closest) {
          const existing = annotations.find(a => a.page === currentPage && Math.abs(a.x - closest.x) < 6 && Math.abs(a.y - closest.y) < 6)
          if (existing) { startEditing(existing, false); return }
          const ann = makeAnnotationFromText(closest)
          setAnnotations([...annotations, ann])
          startEditing(ann, true)
        }
        return
      }

      // Collect overlapping extracted text items
      const hits = extractedTexts.filter(t =>
        t.x < maxX && t.x + t.width > minX &&
        t.y < maxY && t.y + t.height > minY &&
        t.str.trim()
      )
      if (hits.length === 0) return

      // Crop each hit to only the selected range (character-level approximation)
      let parts: string[] = []
      let topY = Infinity
      let leftX = Infinity
      let totalW = 0
      let tallestH = 0

      hits.forEach(t => {
        const charW = t.width / Math.max(t.str.length, 1)
        const startIdx = Math.max(0, Math.floor((minX - t.x) / charW))
        const endIdx = Math.min(t.str.length, Math.ceil((maxX - t.x) / charW))
        const slice = t.str.substring(startIdx, endIdx).trim()
        if (slice) {
          parts.push(slice)
          topY = Math.min(topY, t.y)
          leftX = Math.min(leftX, t.x + startIdx * charW)
          totalW = Math.max(totalW, (endIdx - startIdx) * charW)
          tallestH = Math.max(tallestH, t.height)
        }
      })

      const combined = parts.join(" ").trim()
      if (!combined) return

      const ann: TextAnnotation = {
        id: `ann-${Date.now()}`,
        page: currentPage,
        pageScale: scale,
        x: leftX, y: topY,
        width: Math.max(totalW, 60),
        height: tallestH || 18,
        text: combined,
        originalText: combined,
        fontSize: Math.max(tallestH - 4, 10),
        color: "#000000",
        isBold: false, isItalic: false,
      }
      setAnnotations([...annotations, ann])
      startEditing(ann, true)
    }
  }

  // ── Annotation child handlers ────────────────────────────────────────────
  const handleAnnotationPointerDown = (e: React.PointerEvent, ann: TextAnnotation) => {
    e.stopPropagation()
    if (activeTool === "delete") {
      setAnnotations(annotations.filter(a => a.id !== ann.id))
    } else if (activeTool === "select" || activeTool === "text") {
      startEditing(ann, false)
    } else if (activeTool === "move") {
      movingRef.current = { id: ann.id, lastX: e.clientX, lastY: e.clientY }
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    if (e.relatedTarget && (e.relatedTarget as HTMLElement).closest(".format-toolbar")) return
    completeEditing()
  }

  // ── Cursor style ─────────────────────────────────────────────────────────
  const containerCursor =
    activeTool === "text" ? "cursor-text" :
      activeTool === "select" ? "cursor-crosshair" :
        activeTool === "move" ? "cursor-default" :
          activeTool === "delete" ? "cursor-pointer" :
            "cursor-default"

  const pageAnnotations = annotations.filter(a => a.page === currentPage)

  return (
    <div
      className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center"
      ref={containerRef}
    >
      <div className="relative select-none">
        {/* PDF container */}
        <div
          className={cn(
            "relative bg-white rounded-lg shadow-2xl overflow-visible",
            containerCursor
          )}
          style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)" }}
          onPointerDown={handleContainerPointerDown}
          onPointerMove={handleContainerPointerMove}
          onPointerUp={handleContainerPointerUp}
          onPointerLeave={(e) => { if (activeTool === "move") movingRef.current = null }}
        >
          {/* PDF canvas */}
          <canvas ref={canvasRef} className="block rounded-lg" />

          {/* Selection rubber-band */}
          {selBox && (
            <div
              className="absolute border-2 border-primary bg-primary/10 pointer-events-none z-50 rounded"
              style={{
                left: Math.min(selBox.sx, selBox.cx),
                top: Math.min(selBox.sy, selBox.cy),
                width: Math.abs(selBox.cx - selBox.sx),
                height: Math.abs(selBox.cy - selBox.sy),
              }}
            />
          )}

          {/* Annotation overlays */}
          {pageAnnotations.map((ann) => {
            const w = Math.max(ann.width || 120, 60)
            const h = Math.max(ann.height || 20, 16)
            const isEditing = editingId === ann.id

            return (
              <div
                key={ann.id}
                className={cn(
                  "absolute z-10 rounded",
                  activeTool === "delete" && "cursor-pointer opacity-80 hover:opacity-60 ring-1 ring-red-400",
                  activeTool === "move" && "cursor-move ring-1 ring-primary/50",
                  isEditing && "z-20"
                )}
                style={{
                  left: ann.x,
                  top: ann.y,
                  width: w,
                  minHeight: h,
                  background: "white",
                }}
                onPointerDown={(e) => handleAnnotationPointerDown(e, ann)}
              >
                {isEditing ? (
                  <>
                    {/* Format toolbar */}
                    <div
                      className="format-toolbar absolute flex items-center gap-1 bg-white border border-border shadow-lg rounded-lg p-1 z-50"
                      style={{ top: -44, left: 0, whiteSpace: "nowrap" }}
                    >
                      <button
                        tabIndex={-1}
                        className={cn("px-2 py-1 rounded text-sm font-bold text-black hover:bg-muted", ann.isBold && "bg-muted ring-1 ring-primary")}
                        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); updateAnnotation(ann.id, { isBold: !ann.isBold }) }}
                      >B</button>
                      <button
                        tabIndex={-1}
                        className={cn("px-2 py-1 rounded text-sm italic text-black hover:bg-muted", ann.isItalic && "bg-muted ring-1 ring-primary")}
                        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); updateAnnotation(ann.id, { isItalic: !ann.isItalic }) }}
                      >I</button>
                      <div className="w-px h-5 bg-border mx-1" />
                      <label className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>Size</span>
                        <input
                          tabIndex={-1}
                          type="number"
                          min={6} max={96}
                          value={Math.round(ann.fontSize || 14)}
                          className="w-14 border rounded px-1 py-0.5 text-sm bg-background text-foreground"
                          onPointerDown={e => e.stopPropagation()}
                          onChange={e => updateAnnotation(ann.id, { fontSize: parseInt(e.target.value) || 14 })}
                        />
                      </label>
                      <div className="w-px h-5 bg-border mx-1" />
                      <label className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
                        <span>Color</span>
                        <input
                          tabIndex={-1}
                          type="color"
                          value={ann.color || "#000000"}
                          className="w-7 h-7 border-0 rounded cursor-pointer"
                          onPointerDown={e => e.stopPropagation()}
                          onChange={e => updateAnnotation(ann.id, { color: e.target.value })}
                        />
                      </label>
                      <div className="w-px h-5 bg-border mx-1" />
                      <button
                        tabIndex={-1}
                        title="Delete Annotation"
                        className="px-2 py-1.5 rounded text-red-500 hover:bg-muted font-bold flex items-center"
                        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); setAnnotations(annotations.filter(a => a.id !== ann.id)); setEditingId(null); editingContextRef.current = null; }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="w-px h-5 bg-border mx-1" />
                      <button
                        tabIndex={-1}
                        title="Save Changes"
                        className="px-2 py-1.5 rounded text-green-600 hover:bg-muted font-bold flex items-center pr-3"
                        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); completeEditing(); }}
                      >
                        <Check className="w-4 h-4 mr-1" /> Save
                      </button>
                    </div>

                    {/* Editable textarea */}
                    <textarea
                      autoFocus
                      value={ann.text}
                      onChange={e => updateAnnotation(ann.id, { text: e.target.value })}
                      onBlur={handleBlur}
                      className="w-full block resize-none focus:outline-none bg-transparent font-sans"
                      style={{
                        height: h,
                        fontSize: `${ann.fontSize || 14}px`,
                        fontWeight: ann.isBold ? "bold" : "normal",
                        fontStyle: ann.isItalic ? "italic" : "normal",
                        color: ann.color || "#000000",
                        lineHeight: 1.2,
                        padding: 0,
                        margin: 0,
                        border: "none",
                        outline: "2px solid hsl(var(--primary))",
                        outlineOffset: "2px",
                        borderRadius: "4px",
                      }}
                    />
                  </>
                ) : (
                  // Static display — opaque white box hides original PDF text
                  <div
                    className={cn(
                      "w-full h-full font-sans select-none",
                      activeTool === "move" && "cursor-move",
                      activeTool !== "delete" && activeTool !== "move" && "hover:outline hover:outline-1 hover:outline-primary/40"
                    )}
                    style={{
                      fontSize: `${ann.fontSize || 14}px`,
                      fontWeight: ann.isBold ? "bold" : "normal",
                      fontStyle: ann.isItalic ? "italic" : "normal",
                      color: ann.color || "#000000",
                      lineHeight: 1.2,
                      minHeight: h,
                      padding: 0,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {ann.text}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
