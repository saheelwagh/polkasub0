"use client"

import { Button } from "@/components/ui/button-extended"
import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import Link from "next/link"
import { ArrowRight, Zap, Shield, DollarSign } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      
      {/* Hero Section */}
      <section className="px-6 pt-20 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Support creators with{" "}
            <span className="text-primary">streaming crypto payments</span>
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto">
            No more platform fees. No more delayed payments. Just direct, streaming subscriptions 
            that unlock exclusive content instantly on Polkadot.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/creators">
                Browse Creators <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
              <Link href="/register">
                Become a Creator
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="px-6 py-16 bg-card">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              The creator economy is broken
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Traditional platforms take huge cuts and delay payments for months
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Problems */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground">Current Problems</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-foreground">High Platform Fees</p>
                    <p className="text-sm text-muted-foreground">Platforms take 10-30% of creator earnings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-foreground">Delayed Payments</p>
                    <p className="text-sm text-muted-foreground">Creators wait weeks or months to get paid</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-foreground">No Control</p>
                    <p className="text-sm text-muted-foreground">Platforms can ban creators or change rules anytime</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-primary">Creator Treasury Solution</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-foreground">Zero Platform Fees</p>
                    <p className="text-sm text-muted-foreground">Direct payments between fans and creators</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-foreground">Instant Streaming Payments</p>
                    <p className="text-sm text-muted-foreground">Creators get paid every second, not every month</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-foreground">Full Ownership</p>
                    <p className="text-sm text-muted-foreground">Decentralized smart contracts, no middleman</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple 3-step process powered by Polkadot smart contracts
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">1. Subscribe</h3>
              <p className="text-muted-foreground">
                Choose a creator and deposit DOT for your monthly subscription. 
                Your payment streams to them every second.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">2. Stream</h3>
              <p className="text-muted-foreground">
                Your subscription payment flows to the creator in real-time. 
                They can claim earnings anytime.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">3. Unlock</h3>
              <p className="text-muted-foreground">
                Get instant access to exclusive content. Cancel anytime 
                and get refunded for unused time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Ready to revolutionize creator support?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the decentralized creator economy today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link href="/creators">
                Discover Creators
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/register">
                Start Creating
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
