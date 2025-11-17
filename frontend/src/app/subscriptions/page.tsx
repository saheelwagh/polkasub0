"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button-extended"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Link from "next/link"
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Clock, 
  ExternalLink,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Pause,
  Play
} from "lucide-react"

// Mock subscription data
const mockSubscriptions = [
  {
    id: 1,
    creator: {
      id: "0x1234567890abcdef",
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      tags: ["Web3", "Polkadot", "Tutorials"]
    },
    monthlyAmount: 5,
    totalPaid: 45.75,
    startDate: "2024-01-15",
    status: "active",
    nextPayment: "2024-04-15",
    timeRemaining: "15 days",
    contentAccessed: 8,
    totalContent: 12
  },
  {
    id: 2,
    creator: {
      id: "0x2345678901bcdef0",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      tags: ["DeFi", "Research", "Analysis"]
    },
    monthlyAmount: 8,
    totalPaid: 24.5,
    startDate: "2024-02-20",
    status: "active",
    nextPayment: "2024-04-20",
    timeRemaining: "20 days",
    contentAccessed: 5,
    totalContent: 8
  },
  {
    id: 3,
    creator: {
      id: "0x3456789012cdef01",
      name: "Marcus Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      tags: ["Security", "Auditing", "ink!"]
    },
    monthlyAmount: 12,
    totalPaid: 156.8,
    startDate: "2023-08-10",
    status: "paused",
    nextPayment: null,
    timeRemaining: "Paused",
    contentAccessed: 15,
    totalContent: 15
  }
]

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions)
  const [cancellingId, setCancellingId] = useState<number | null>(null)

  const totalMonthlySpend = subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((sum, sub) => sum + sub.monthlyAmount, 0)

  const totalPaid = subscriptions.reduce((sum, sub) => sum + sub.totalPaid, 0)

  const handleCancelSubscription = async (subscriptionId: number) => {
    setCancellingId(subscriptionId)
    
    // Simulate cancellation process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, status: 'cancelled' as const }
          : sub
      )
    )
    
    setCancellingId(null)
  }

  const handlePauseSubscription = async (subscriptionId: number) => {
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, status: sub.status === 'paused' ? 'active' : 'paused' }
          : sub
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <main className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              My Subscriptions
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your creator subscriptions and streaming payments
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {subscriptions.filter(sub => sub.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Streaming payments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMonthlySpend} DOT</div>
                <p className="text-xs text-muted-foreground">
                  Per month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPaid.toFixed(2)} DOT</div>
                <p className="text-xs text-muted-foreground">
                  All time
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Subscriptions List */}
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className={`transition-all ${
                subscription.status === 'cancelled' ? 'opacity-60' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Creator Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={subscription.creator.avatar}
                        alt={subscription.creator.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {subscription.creator.name}
                          </h3>
                          <Badge 
                            className={
                              subscription.status === 'active' ? 'bg-green-500' :
                              subscription.status === 'paused' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }
                          >
                            {subscription.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {subscription.status === 'paused' && <Pause className="w-3 h-3 mr-1" />}
                            {subscription.status === 'cancelled' && <AlertCircle className="w-3 h-3 mr-1" />}
                            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                          </Badge>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {subscription.creator.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Subscription Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Monthly Rate</p>
                            <p className="font-medium">{subscription.monthlyAmount} DOT</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Paid</p>
                            <p className="font-medium">{subscription.totalPaid} DOT</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Started</p>
                            <p className="font-medium">
                              {new Date(subscription.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Time Remaining</p>
                            <p className="font-medium">{subscription.timeRemaining}</p>
                          </div>
                        </div>

                        {/* Content Progress */}
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Content Accessed</span>
                            <span className="font-medium">
                              {subscription.contentAccessed}/{subscription.totalContent}
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ 
                                width: `${(subscription.contentAccessed / subscription.totalContent) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Button asChild size="sm">
                        <Link href={`/creator/${subscription.creator.id}`}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Profile
                        </Link>
                      </Button>
                      
                      {subscription.status === 'active' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePauseSubscription(subscription.id)}
                          >
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleCancelSubscription(subscription.id)}
                            disabled={cancellingId === subscription.id}
                          >
                            {cancellingId === subscription.id ? "Cancelling..." : "Cancel"}
                          </Button>
                        </>
                      )}
                      
                      {subscription.status === 'paused' && (
                        <Button 
                          size="sm" 
                          onClick={() => handlePauseSubscription(subscription.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                      )}
                      
                      {subscription.status === 'cancelled' && (
                        <Badge variant="secondary">
                          Cancelled
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {subscriptions.filter(sub => sub.status !== 'cancelled').length === 0 && (
            <Card className="text-center py-16">
              <CardContent>
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Active Subscriptions
                </h3>
                <p className="text-muted-foreground mb-6">
                  Discover creators and start supporting them with streaming payments
                </p>
                <Button asChild>
                  <Link href="/creators">
                    Browse Creators
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Call to Action */}
          <Card className="mt-8 bg-primary text-primary-foreground">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">
                Discover More Creators
              </h3>
              <p className="mb-6 opacity-90">
                Support more creators and unlock exclusive content with streaming crypto payments
              </p>
              <Button asChild variant="secondary">
                <Link href="/creators">
                  Browse All Creators
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
