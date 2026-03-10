"use client"

import Link from "next/link"
import { FileText } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">PDF-Flow</span>
          </Link>

          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link href="#privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/editor" className="hover:text-foreground transition-colors">
              Editor
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Built with privacy in mind.
          </p>
        </div>
      </div>
    </footer>
  )
}
