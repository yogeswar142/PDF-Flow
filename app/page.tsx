"use client"

import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { ProcessSection } from "@/components/landing/process-section"
import { TrustSection } from "@/components/landing/trust-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProcessSection />
      <TrustSection />
      <CTASection />
      <Footer />
    </main>
  )
}
