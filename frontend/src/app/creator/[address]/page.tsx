"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button-extended"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Users, DollarSign, Clock, ExternalLink, Lock, CheckCircle } from "lucide-react"

// Mock creator data (in real app, this would be fetched based on address)
const mockCreator = {
  id: "0x1234567890abcdef",
  name: "Alex Chen",
  bio: "Web3 developer creating tutorials on Polkadot & Substrate development. I've been building on Polkadot for 3+ years and love sharing knowledge with the community.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  subscribers: 234,
  monthlyRate: 5,
  totalEarned: 1250,
  contentCount: 12,
  tags: ["Web3", "Polkadot", "Tutorials"],
  socialLinks: {
    twitter: "https://twitter.com/alexchen",
    github: "https://github.com/alexchen",
    website: "https://alexchen.dev"
  },
  exclusiveContent: [
    {
      id: 1,
      title: "Building Your First ink! Smart Contract",
      description: "Complete tutorial with code examples and deployment guide",
      type: "Tutorial",
      duration: "45 min",
      isLocked: true
    },
    {
      id: 2,
      title: "Advanced Substrate Runtime Development",
      description: "Deep dive into custom pallets and runtime configuration",
      type: "Advanced Guide",
      duration: "1.5 hours",
      isLocked: true
    },
    {
      id: 3,
      title: "Polkadot Parachain Integration Patterns",
      description: "Best practices for cross-chain communication with XCM",
      type: "Technical Deep Dive",
      duration: "2 hours",
      isLocked: true
    }
  ]
}

interface CreatorProfileProps {
  params: {
    address: string
  }
}

export default function CreatorProfile({ params }: CreatorProfileProps) {
  const [subscriptionAmount, setSubscriptionAmount] = useState(mockCreator.monthlyRate.toString())
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async () => {
    setIsSubscribing(true)
    // Simulate subscription process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubscribed(true)
    setIsSubscribing(false)
  }

  const handleCancel = async () => {
    setIsSubscribed(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <main className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Creator Header */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar and Basic Info */}
              <div className="flex-shrink-0">
                <img
                  src={mockCreator.avatar}
                  alt={mockCreator.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                />
              </div>

              {/* Creator Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-foreground">
                    {mockCreator.name}
                  </h1>
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Available
                  </Badge>
                </div>

                <p className="text-lg text-muted-foreground mb-4 max-w-2xl">
                  {mockCreator.bio}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {mockCreator.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{mockCreator.subscribers} subscribers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{mockCreator.totalEarned} DOT earned</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ExternalLink className="w-4 h-4" />
                    <span>{mockCreator.contentCount} content pieces</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-4 mt-4">
                  <a 
                    href={mockCreator.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Twitter
                  </a>
                  <a 
                    href={mockCreator.socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    GitHub
                  </a>
                  <a 
                    href={mockCreator.socialLinks.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Website
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Subscription Section */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Subscription
                  </CardTitle>
                  <CardDescription>
                    Support {mockCreator.name} and unlock exclusive content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isSubscribed ? (
                    <>
                      <div>
                        <Label htmlFor="amount">Monthly Amount (DOT)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={subscriptionAmount}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubscriptionAmount(e.target.value)}
                          min="1"
                          step="0.1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Minimum: {mockCreator.monthlyRate} DOT/month
                        </p>
                      </div>
                      
                      <Button 
                        onClick={handleSubscribe}
                        disabled={isSubscribing || parseFloat(subscriptionAmount) < mockCreator.monthlyRate}
                        className="w-full"
                        size="lg"
                      >
                        {isSubscribing ? "Subscribing..." : `Subscribe for ${subscriptionAmount} DOT/month`}
                      </Button>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• Payments stream every second</p>
                        <p>• Cancel anytime with instant refund</p>
                        <p>• Unlock all exclusive content</p>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Active Subscription</span>
                        </div>
                        <p className="text-sm text-green-600">
                          Streaming {subscriptionAmount} DOT/month
                        </p>
                      </div>
                      
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Amount paid:</span>
                          <span className="font-medium">2.5 DOT</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time remaining:</span>
                          <span className="font-medium">15 days</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleCancel}
                        variant="outline"
                        className="w-full"
                      >
                        Cancel Subscription
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Content Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isSubscribed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                    Exclusive Content
                  </CardTitle>
                  <CardDescription>
                    {isSubscribed 
                      ? "You have access to all exclusive content" 
                      : "Subscribe to unlock exclusive content"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCreator.exclusiveContent.map((content) => (
                      <div
                        key={content.id}
                        className={`p-4 border rounded-lg transition-all ${
                          isSubscribed 
                            ? 'border-green-200 bg-green-50/50' 
                            : 'border-border bg-muted/30'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">
                              {content.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {content.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {content.type}
                                </Badge>
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {content.duration}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex-shrink-0 ml-4">
                            {isSubscribed ? (
                              <Button size="sm">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            ) : (
                              <Lock className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!isSubscribed && (
                    <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
                      <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Subscribe to unlock all {mockCreator.contentCount} exclusive content pieces
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
