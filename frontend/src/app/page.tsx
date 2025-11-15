"use client"

import { Button } from "@/components/ui/button-extended"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { config } from "@/lib/reactive-dot/config"
import { App } from "./app"
import { ReactiveDotProvider } from "@reactive-dot/react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Header />

      <div className="mt-6 mb-10 flex items-center justify-center">
        <Button
          asChild
          size="xl"
          variant="default"
          className="shadow-2xl transition hover:shadow-lg"
        >
          <Link href="/landingpage">Launch App</Link>
        </Button>
      </div>

      <section id="app-section" className="w-full">
        <ReactiveDotProvider config={config}>
          <App />
        </ReactiveDotProvider>
      </section>

      <Footer />
    </div>
  )
}
