"use client"

import { ChainProvider, SignerProvider, ReactiveDotProvider } from "@reactive-dot/react"
import { config } from "@/lib/reactive-dot/config"
import { WalletProvider, useWalletContext } from "./wallet-context"

function ReactiveProviders({ children }: { children: React.ReactNode }) {
  const { account, chainId } = useWalletContext()

  return (
    <ReactiveDotProvider config={config}>
      <SignerProvider signer={account?.polkadotSigner}>
        <ChainProvider chainId={chainId}>
          {children}
        </ChainProvider>
      </SignerProvider>
    </ReactiveDotProvider>
  )
}

export function ClientReactiveDotProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WalletProvider>
      <ReactiveProviders>
        {children}
      </ReactiveProviders>
    </WalletProvider>
  )
}
