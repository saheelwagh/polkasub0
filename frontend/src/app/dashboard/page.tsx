"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button-extended"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Upload, 
  Eye, 
  Calendar,
  Clock,
  Wallet,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from "lucide-react"

// Mock creator data
const mockCreatorData = {
  name: "Alex Chen",
  address: "0x1234567890abcdef",
  totalEarned: 1250.75,
  monthlyRate: 5,
  subscribers: 234,
  contentCount: 12,
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  joinedDate: "March 2024"
}

// Mock subscriber data
const mockSubscribers = [
  {
    id: 1,
    name: "Sarah Johnson",
    address: "0x2345678901bcdef0",
    monthlyAmount: 8,
    totalPaid: 24.5,
    joinDate: "2024-01-15",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    address: "0x3456789012cdef01",
    monthlyAmount: 5,
    totalPaid: 45.2,
    joinDate: "2023-11-20",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emma Thompson",
    address: "0x4567890123def012",
    monthlyAmount: 12,
    totalPaid: 156.8,
    joinDate: "2023-08-10",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
  }
]

// Mock content data
const mockContent = [
  {
    id: 1,
    title: "Building Your First ink! Smart Contract",
    type: "Tutorial",
    uploadDate: "2024-03-10",
    views: 89,
    status: "published"
  },
  {
    id: 2,
    title: "Advanced Substrate Runtime Development",
    type: "Advanced Guide",
    uploadDate: "2024-03-05",
    views: 67,
    status: "published"
  },
  {
    id: 3,
    title: "Polkadot Parachain Integration Patterns",
    type: "Technical Deep Dive",
    uploadDate: "2024-02-28",
    views: 124,
    status: "published"
  }
]

export default function DashboardPage() {
  const [streamingEarnings, setStreamingEarnings] = useState(1250.75)
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    ipfsHash: "",
    type: "Tutorial"
  })
  const [isUploading, setIsUploading] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimableAmount, setClaimableAmount] = useState(12.45)

  // Simulate streaming earnings
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamingEarnings(prev => prev + 0.001) // Add small amount every second
      setClaimableAmount(prev => prev + 0.001)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleClaimEarnings = async () => {
    setIsClaiming(true)
    // Simulate claiming process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setClaimableAmount(0)
    setIsClaiming(false)
  }

  const handleUploadContent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 3000))
    setNewContent({ title: "", description: "", ipfsHash: "", type: "Tutorial" })
    setIsUploading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <main className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={mockCreatorData.avatar}
                alt={mockCreatorData.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {mockCreatorData.name}
                </h1>
                <p className="text-muted-foreground">
                  Creator since {mockCreatorData.joinedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{streamingEarnings.toFixed(3)} DOT</div>
                <p className="text-xs text-muted-foreground">
                  +2.3% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCreatorData.subscribers}</div>
                <p className="text-xs text-muted-foreground">
                  +12 new this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCreatorData.monthlyRate} DOT</div>
                <p className="text-xs text-muted-foreground">
                  Per subscriber
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content Pieces</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCreatorData.contentCount}</div>
                <p className="text-xs text-muted-foreground">
                  +2 this month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Earnings Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Earnings Management
                  </CardTitle>
                  <CardDescription>
                    Claim your streaming earnings from subscribers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Claimable Amount */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-800">Claimable Earnings</span>
                        <span className="text-2xl font-bold text-green-800">
                          {claimableAmount.toFixed(3)} DOT
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Clock className="w-4 h-4" />
                        <span>Streaming live from {mockSubscribers.length} active subscribers</span>
                      </div>
                    </div>

                    {/* Claim Button */}
                    <Button
                      onClick={handleClaimEarnings}
                      disabled={claimableAmount < 0.001 || isClaiming}
                      className="w-full"
                      size="lg"
                    >
                      {isClaiming ? "Claiming..." : `Claim ${claimableAmount.toFixed(3)} DOT`}
                    </Button>

                    {/* Earnings Breakdown */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Earnings Breakdown</h4>
                      {mockSubscribers.map((subscriber) => (
                        <div key={subscriber.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <img
                              src={subscriber.avatar}
                              alt={subscriber.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span>{subscriber.name}</span>
                          </div>
                          <span className="font-medium">{subscriber.monthlyAmount} DOT/month</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload New Content
                  </CardTitle>
                  <CardDescription>
                    Add exclusive content for your subscribers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUploadContent} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Content Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter content title"
                          value={newContent.title}
                          onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Content Type</Label>
                        <select
                          id="type"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background"
                          value={newContent.type}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewContent(prev => ({ ...prev, type: e.target.value }))}
                        >
                          <option value="Tutorial">Tutorial</option>
                          <option value="Advanced Guide">Advanced Guide</option>
                          <option value="Technical Deep Dive">Technical Deep Dive</option>
                          <option value="Video">Video</option>
                          <option value="Article">Article</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your content..."
                        rows={3}
                        value={newContent.description}
                        onChange={(e) => setNewContent(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ipfsHash">IPFS Hash</Label>
                      <Input
                        id="ipfsHash"
                        placeholder="QmX7M9CiYXjVQX8Z2HvjKq4XvLqWjAoKGmhq9F3nR8sT4u"
                        value={newContent.ipfsHash}
                        onChange={(e) => setNewContent(prev => ({ ...prev, ipfsHash: e.target.value }))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload your content to IPFS first, then paste the hash here
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={!newContent.title || !newContent.description || !newContent.ipfsHash || isUploading}
                      className="w-full"
                    >
                      {isUploading ? "Uploading..." : "Upload Content"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Recent Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Content</CardTitle>
                  <CardDescription>
                    Manage your exclusive content library
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockContent.map((content) => (
                      <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{content.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant="outline">{content.type}</Badge>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(content.uploadDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {content.views} views
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Published
                          </Badge>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Subscriber List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Subscribers</CardTitle>
                  <CardDescription>
                    {mockSubscribers.length} subscribers streaming payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockSubscribers.map((subscriber) => (
                      <div key={subscriber.id} className="flex items-center gap-3">
                        <img
                          src={subscriber.avatar}
                          alt={subscriber.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{subscriber.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {subscriber.monthlyAmount} DOT/month
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{subscriber.totalPaid} DOT</p>
                          <p className="text-xs text-muted-foreground">total paid</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Subscriber Growth</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Content Engagement</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Earnings Goal</span>
                      <span>62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Public Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Subscribers
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
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
