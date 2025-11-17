"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type { ChainId, WalletAccount } from "@/lib/reactive-dot/custom-types"

interface WalletContextType {
  account: WalletAccount | undefined
  setAccount: (account: WalletAccount | undefined) => void
  chainId: ChainId
  setChainId: (chainId: ChainId) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<WalletAccount>()
  const [chainId, setChainId] = useState<ChainId>("passethub")

  return (
    <WalletContext.Provider value={{ account, setAccount, chainId, setChainId }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWalletContext() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider")
  }
  return context
}
