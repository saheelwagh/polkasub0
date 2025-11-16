"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button-extended"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Logo } from "./logo"
import { Wallet, ChevronDown } from "lucide-react"

export function Navbar() {
  const [isConnected, setIsConnected] = useState(false)
  const [mockBalance] = useState("125.45")
  const [mockAddress] = useState("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")

  const handleConnect = () => {
    setIsConnected(!isConnected)
  }

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
                href="/register" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Become a Creator
              </Link>
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Wallet Connection - Mock Implementation */}
          <div className="flex items-center gap-3">
            {/* Chain Badge */}
            <Badge variant="secondary" className="hidden sm:flex">
              Polkadot
            </Badge>

            {/* Balance Display */}
            {isConnected && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span>{mockBalance} DOT</span>
              </div>
            )}

            {/* Connect/Account Button */}
            {!isConnected ? (
              <Button onClick={handleConnect} size="sm">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            ) : (
              <Button 
                onClick={handleConnect} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="hidden sm:inline">
                  {mockAddress.slice(0, 6)}...{mockAddress.slice(-4)}
                </span>
                <span className="sm:hidden">Connected</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
