"use client"

import { MousePointer2, Type, Trash2, Move } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Tool } from "./editor-workspace"

interface FloatingToolbarProps {
  activeTool: Tool
  onToolChange: (tool: Tool) => void
}

const tools = [
  { id: "select" as Tool, label: "Select", icon: MousePointer2 },
  { id: "text" as Tool, label: "Add Text", icon: Type },
  { id: "move" as Tool, label: "Move", icon: Move },
  { id: "delete" as Tool, label: "Delete", icon: Trash2 },
]

export function FloatingToolbar({ activeTool, onToolChange }: FloatingToolbarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-1 bg-card rounded-xl border border-border shadow-lg px-2 py-1.5">
          {tools.map((tool, index) => (
            <div key={tool.id} className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onToolChange(tool.id)}
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
                      activeTool === tool.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <tool.icon className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {tool.label}
                </TooltipContent>
              </Tooltip>
              {index < tools.length - 1 && (
                <div className="w-px h-5 bg-border mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
