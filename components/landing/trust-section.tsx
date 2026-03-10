"use client"

import { UserX, DollarSign, Lock } from "lucide-react"
import { motion } from "framer-motion"

const trustFeatures = [
  {
    icon: UserX,
    title: "No Sign-in Required",
    description: "Jump straight into editing. We don't collect emails, usernames, or any personal information.",
  },
  {
    icon: DollarSign,
    title: "100% Free",
    description: "No hidden fees, no premium tiers, no credit card required. All features are completely free.",
  },
  {
    icon: Lock,
    title: "Privacy-First",
    description: "Your data never leaves your browser. We can't see your files because they never touch our servers.",
  },
]

export function TrustSection() {
  return (
    <section id="privacy" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Choose Us
          </motion.span>
          <motion.h2
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Built on trust and transparency
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We believe PDF editing should be simple, free, and private. No exceptions.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="relative group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional privacy note */}
        <motion.div
          className="mt-16 p-6 md:p-8 rounded-2xl bg-muted/50 border border-border text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Technical Note:</span>{" "}
            PDF-Flow uses WebAssembly to process documents entirely client-side. 
            Your browser does all the work, making editing instant and keeping your data secure.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
