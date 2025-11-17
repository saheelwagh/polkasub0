"use client"

import { ReactiveDotProvider } from "@reactive-dot/react"
import { config } from "@/lib/reactive-dot/config"

export function ClientReactiveDotProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReactiveDotProvider config={config}>
      {children}
    </ReactiveDotProvider>
  )
}
