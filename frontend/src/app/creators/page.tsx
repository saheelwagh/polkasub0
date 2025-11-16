"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button-extended"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, DollarSign, CheckCircle } from "lucide-react"

// Mock creator data
const mockCreators = [
  {
    id: "0x1234567890abcdef",
    name: "Alex Chen",
    bio: "Web3 developer creating tutorials on Polkadot & Substrate development",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    subscribers: 234,
    monthlyRate: 5,
    contentCount: 12,
    isEligible: true, // Only this creator is eligible for donations
    tags: ["Web3", "Polkadot", "Tutorials"]
  },
  {
    id: "0x2345678901bcdef0",
    name: "Sarah Johnson",
    bio: "DeFi researcher sharing market insights and protocol analysis",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    subscribers: 156,
    monthlyRate: 8,
    contentCount: 8,
    isEligible: false,
    tags: ["DeFi", "Research", "Analysis"]
  },
  {
    id: "0x3456789012cdef01",
    name: "Marcus Rodriguez",
    bio: "Smart contract auditor teaching security best practices",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    subscribers: 89,
    monthlyRate: 12,
    contentCount: 15,
    isEligible: false,
    tags: ["Security", "Auditing", "ink!"]
  },
  {
    id: "0x4567890123def012",
    name: "Emma Thompson",
    bio: "Parachain developer building cross-chain applications",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    subscribers: 67,
    monthlyRate: 6,
    contentCount: 9,
    isEligible: false,
    tags: ["Parachains", "XCM", "Development"]
  },
  {
    id: "0x5678901234ef0123",
    name: "David Kim",
    bio: "Blockchain educator creating beginner-friendly content",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    subscribers: 312,
    monthlyRate: 4,
    contentCount: 22,
    isEligible: false,
    tags: ["Education", "Beginner", "Blockchain"]
  },
  {
    id: "0x6789012345f01234",
    name: "Lisa Wang",
    bio: "NFT artist exploring digital ownership on Polkadot",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    subscribers: 145,
    monthlyRate: 10,
    contentCount: 6,
    isEligible: false,
    tags: ["NFTs", "Art", "Digital"]
  }
]

export default function CreatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <main className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Discover Creators
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Support your favorite creators with streaming crypto payments and unlock exclusive content
            </p>
          </div>

          {/* Creators Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockCreators.map((creator) => (
              <div
                key={creator.id}
                className={`relative rounded-2xl bg-card p-6 shadow-md transition-all hover:shadow-lg ${
                  creator.isEligible 
                    ? 'border-2 border-green-500 hover:border-green-600 cursor-pointer' 
                    : 'border border-border cursor-not-allowed opacity-75'
                }`}
              >
                {/* Eligible Badge */}
                {creator.isEligible && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-green-500 text-white border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Available
                    </Badge>
                  </div>
                )}

                {/* Creator Info */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {creator.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {creator.bio}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {creator.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{creator.subscribers} subscribers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{creator.monthlyRate} DOT/month</span>
                  </div>
                </div>

                {/* Content Count */}
                <p className="text-sm text-muted-foreground mb-4">
                  {creator.contentCount} exclusive content pieces
                </p>

                {/* Action Button */}
                {creator.isEligible ? (
                  <Button asChild className="w-full">
                    <Link href={`/creator/${creator.id}`}>
                      View Profile
                    </Link>
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    Coming Soon
                  </Button>
                )}

                {/* Green underline for eligible creator */}
                {creator.isEligible && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 rounded-b-2xl"></div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Want to become a creator?
            </h2>
            <p className="text-muted-foreground mb-6">
              Start earning from your content with streaming crypto payments
            </p>
            <Button asChild size="lg">
              <Link href="/register">
                Register as Creator
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
