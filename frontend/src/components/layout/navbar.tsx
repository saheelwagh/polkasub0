"use client"

import { Suspense } from "react"
import { ButtonSkeleton } from "@/components/layout/skeletons"
import { AccountSelect } from "@/components/web3/account-select"
import { ChainSelect } from "@/components/web3/chain-select"
import { AccountBalance } from "@/components/web3/account-balance"
import { useWalletContext } from "@/components/providers/wallet-context"
import Link from "next/link"
import { Logo } from "./logo"

export function Navbar() {
  const { account, setAccount, chainId, setChainId } = useWalletContext()

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/creators" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Discover Creators
              </Link>
              <Link 
                href="/subscriptions" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                My Subscriptions
              </Link>
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Creator Dashboard
              </Link>
              <Link 
                href="/register" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Become a Creator
              </Link>
            </div>
          </div>

          {/* Original Wallet Connection Components */}
          <div className="flex items-center gap-3">
            {/* Chain Selector */}
            <Suspense fallback={<ButtonSkeleton />}>
              <ChainSelect chainId={chainId} setChainId={setChainId} />
            </Suspense>

            {/* Account Balance */}
            <Suspense fallback={<div className="w-20 h-8"></div>}>
              <AccountBalance />
            </Suspense>

            {/* Connect Button */}
            <Suspense fallback={<ButtonSkeleton />}>
              <AccountSelect account={account} setAccount={setAccount} />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  )
}
