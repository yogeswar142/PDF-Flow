"use client"

import Link from "next/link"
import { ArrowRight, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">100% Private & Secure</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Edit PDFs instantly.
            <span className="block text-primary">No uploads required.</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-pretty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            The fastest way to edit PDFs directly in your browser. Your files never leave your device. 
            No sign-ups, no subscriptions, no compromises.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button asChild size="lg" className="w-full sm:w-auto text-base px-8">
              <Link href="/editor">
                Start Editing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
              <Link href="#how-it-works">
                See How it Works
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>Instant Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>No Data Collection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-primary">Free</span>
              <span>Forever</span>
            </div>
          </motion.div>
        </div>

        {/* Hero image/mockup */}
        <motion.div
          className="mt-16 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="relative mx-auto max-w-5xl">
            <div className="aspect-[16/10] rounded-xl bg-card border border-border shadow-2xl overflow-hidden">
              <div className="flex h-full">
                {/* Sidebar mockup */}
                <div className="w-20 bg-muted border-r border-border p-2 hidden sm:block">
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-[3/4] rounded bg-background border border-border" />
                    ))}
                  </div>
                </div>
                {/* Main canvas mockup */}
                <div className="flex-1 p-4 sm:p-8 flex items-center justify-center bg-muted/50">
                  <div className="aspect-[8.5/11] w-full max-w-md rounded-lg bg-card shadow-lg border border-border p-6 sm:p-8">
                    <div className="space-y-4">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-5/6" />
                      <div className="h-3 bg-muted rounded w-4/5" />
                      <div className="h-16 bg-muted/50 rounded mt-6" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating toolbar mockup */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2 bg-card rounded-lg border border-border shadow-lg px-3 py-2">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                <div className="w-4 h-4 rounded-sm bg-primary/50" />
              </div>
              <div className="w-px h-6 bg-border" />
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                <div className="w-4 h-0.5 bg-muted-foreground" />
              </div>
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                <div className="w-3 h-3 border border-muted-foreground rounded-sm" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
