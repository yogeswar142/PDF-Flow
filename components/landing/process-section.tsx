"use client"

import { Upload, Cpu, Edit3, Download } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const steps = [
  {
    number: "01",
    title: "Upload PDF",
    description: "Drag and drop your PDF or click to browse. Files are processed entirely in your browser.",
    icon: Upload,
  },
  {
    number: "02",
    title: "Instant Browser Processing",
    description: "Your PDF is rendered locally using WebAssembly. No server uploads, no waiting.",
    icon: Cpu,
  },
  {
    number: "03",
    title: "Edit Text Locally",
    description: "Add text, annotations, and highlights with our intuitive editing tools.",
    icon: Edit3,
  },
  {
    number: "04",
    title: "Download",
    description: "Export your edited PDF instantly. Your original file stays on your device.",
    icon: Download,
  },
]

export function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"])

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/30" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.span>
          <motion.h2
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Edit PDFs in four simple steps
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            No complicated software to install. No accounts to create. Just open and edit.
          </motion.p>
        </div>

        <div className="relative">
          {/* Vertical progress line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2 hidden sm:block">
            <motion.div
              className="w-full bg-primary origin-top"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-12 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Step number bubble */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-card border-2 border-primary shadow-lg z-10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>

                {/* Content */}
                <div
                  className={`flex-1 pl-24 md:pl-0 ${
                    index % 2 === 0 ? "md:pr-24 md:text-right" : "md:pl-24 md:text-left"
                  }`}
                >
                  <span className="text-sm font-mono text-primary mb-2 block">{step.number}</span>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Visual card */}
                <div
                  className={`flex-1 pl-24 md:pl-0 ${
                    index % 2 === 0 ? "md:pl-24" : "md:pr-24"
                  }`}
                >
                  <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
                    <div className="aspect-[4/3] rounded-lg bg-muted flex items-center justify-center">
                      <step.icon className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
