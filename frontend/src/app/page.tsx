"use client"

import { Button } from "@/components/ui/button-extended"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { config } from "@/lib/reactive-dot/config"
import { App } from "./app"
import { ReactiveDotProvider } from "@reactive-dot/react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />

      <ReactiveDotProvider config={config}>
        <App />
      </ReactiveDotProvider>

      <Footer />
    </div>
  )
}
