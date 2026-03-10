"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-primary relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl text-balance"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to edit your first PDF?
          </motion.h2>
          <motion.p
            className="mt-6 text-lg text-primary-foreground/80 max-w-2xl mx-auto text-pretty"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of users who trust PDF-Flow for their document editing needs. 
            No account required, start editing in seconds.
          </motion.p>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-base px-8 py-6 h-auto"
            >
              <Link href="/editor">
                Launch Editor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
