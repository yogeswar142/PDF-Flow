"use client"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { PDFPage } from "./editor-workspace"

interface PageSidebarProps {
  pages: PDFPage[]
  currentPage: number
  onPageSelect: (page: number) => void
}

export function PageSidebar({ pages, currentPage, onPageSelect }: PageSidebarProps) {
  return (
    <aside className="w-20 md:w-24 bg-card border-r border-border shrink-0">
      <ScrollArea className="h-full">
        <div className="p-2 space-y-2">
          {pages.map((page) => (
            <div key={page.id} className="flex flex-col items-center gap-1.5 pb-2">
              <button
                onClick={() => onPageSelect(page.id)}
                className={cn(
                  "w-full aspect-[3/4] rounded-lg border-2 transition-all duration-200 overflow-hidden",
                  "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  currentPage === page.id
                    ? "border-primary shadow-md"
                    : "border-border bg-muted"
                )}
              >
                <div className="w-full h-full bg-card flex flex-col items-center justify-center p-1">
                  {/* Mock page content */}
                  <div className="w-full space-y-1">
                    <div className="h-1 bg-muted rounded w-3/4 mx-auto" />
                    <div className="h-0.5 bg-muted rounded w-full" />
                    <div className="h-0.5 bg-muted rounded w-5/6" />
                    <div className="h-0.5 bg-muted rounded w-4/5" />
                    <div className="h-2 bg-muted/50 rounded mt-1" />
                    <div className="h-0.5 bg-muted rounded w-full" />
                    <div className="h-0.5 bg-muted rounded w-3/4" />
                  </div>
                </div>
              </button>
              <span className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded-full transition-colors", 
                currentPage === page.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}>
                {page.id}
              </span>
            </div>
          ))}
          {pages.length > 0 && (
            <div className="text-center py-2">
              <span className="text-xs text-muted-foreground">
                {currentPage}/{pages.length}
              </span>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
