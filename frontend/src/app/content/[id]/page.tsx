"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button-extended"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Link from "next/link"
import { 
  Lock, 
  CheckCircle, 
  Clock, 
  User, 
  ArrowLeft, 
  ExternalLink,
  Play,
  FileText,
  Download
} from "lucide-react"

// Mock content data
const mockContent = {
  id: "1",
  title: "Building Your First ink! Smart Contract",
  description: "Complete tutorial with code examples and deployment guide. Learn how to create, test, and deploy smart contracts on Polkadot using the ink! framework.",
  type: "Tutorial",
  duration: "45 min",
  createdAt: "2024-03-10",
  creator: {
    id: "0x1234567890abcdef",
    name: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  content: {
    // Mock IPFS content
    sections: [
      {
        id: 1,
        title: "Introduction to ink!",
        type: "text",
        content: `ink! is Rust-based embedded domain specific language (eDSL) for writing smart contracts specifically for blockchains built on the Substrate framework. 

Key benefits of ink!:
• Memory safety through Rust
• Small contract size
• Efficient execution
• Seamless integration with Substrate

In this tutorial, we'll build a simple storage contract that demonstrates the core concepts of ink! development.`
      },
      {
        id: 2,
        title: "Setting Up Your Development Environment",
        type: "code",
        content: `# Install Rust and Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install ink! CLI
cargo install cargo-contract --force

# Create new ink! project
cargo contract new my_contract
cd my_contract

# Build the contract
cargo contract build`
      },
      {
        id: 3,
        title: "Contract Structure Explained",
        type: "video",
        content: "https://example.com/video/contract-structure.mp4",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop"
      },
      {
        id: 4,
        title: "Testing Your Contract",
        type: "text",
        content: `Testing is crucial for smart contract development. ink! provides excellent testing capabilities:

## Unit Tests
ink! contracts can include unit tests that run off-chain:

\`\`\`rust
#[cfg(test)]
mod tests {
    use super::*;

    #[ink::test]
    fn default_works() {
        let contract = MyContract::default();
        assert_eq!(contract.get(), false);
    }
}
\`\`\`

## Integration Tests
For more complex testing scenarios, use the ink! e2e testing framework.`
      }
    ]
  },
  isLocked: false, // Set to true to show locked state
  requiredSubscription: {
    creatorName: "Alex Chen",
    monthlyRate: 5
  }
}

interface ContentPageProps {
  params: {
    id: string
  }
}

export default function ContentPage({ params }: ContentPageProps) {
  const [isSubscribed, setIsSubscribed] = useState(!mockContent.isLocked)

  const handleSubscribe = () => {
    // In real app, this would redirect to subscription flow
    setIsSubscribed(true)
  }

  const renderContentSection = (section: any) => {
    switch (section.type) {
      case 'text':
        return (
          <div className="prose prose-gray max-w-none">
            <div className="whitespace-pre-line text-foreground leading-relaxed">
              {section.content}
            </div>
          </div>
        )
      
      case 'code':
        return (
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
              <code>{section.content}</code>
            </pre>
          </div>
        )
      
      case 'video':
        return (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <img
              src={section.thumbnail}
              alt="Video thumbnail"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button size="lg" className="rounded-full w-16 h-16">
                <Play className="w-6 h-6" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <Badge className="bg-black/50">Video Content</Badge>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  if (mockContent.isLocked && !isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Navbar />
        
        <main className="px-6 py-12">
          <div className="mx-auto max-w-4xl">
            {/* Back Button */}
            <Button variant="ghost" asChild className="mb-6">
              <Link href={`/creator/${mockContent.creator.id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Creator
              </Link>
            </Button>

            {/* Locked Content */}
            <Card className="border-2 border-dashed border-muted-foreground/30">
              <CardContent className="text-center py-16">
                <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                
                <h1 className="text-3xl font-bold text-foreground mb-4">
                  {mockContent.title}
                </h1>
                
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  {mockContent.description}
                </p>

                <div className="flex items-center justify-center gap-4 mb-8 text-sm text-muted-foreground">
                  <Badge variant="outline">{mockContent.type}</Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {mockContent.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {mockContent.creator.name}
                  </span>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8 max-w-md mx-auto">
                  <h3 className="font-semibold text-foreground mb-2">
                    Subscription Required
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Subscribe to {mockContent.requiredSubscription.creatorName} for {mockContent.requiredSubscription.monthlyRate} DOT/month to unlock this content
                  </p>
                  
                  <Button onClick={handleSubscribe} className="w-full">
                    Subscribe to Unlock
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Cancel anytime • Instant refunds • Stream payments every second
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <main className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href={`/creator/${mockContent.creator.id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Creator
            </Link>
          </Button>

          {/* Content Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Unlocked Content</span>
            </div>
            
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {mockContent.title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6">
              {mockContent.description}
            </p>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <img
                  src={mockContent.creator.avatar}
                  alt={mockContent.creator.name}
                  className="w-6 h-6 rounded-full"
                />
                <span>{mockContent.creator.name}</span>
              </div>
              <Badge variant="outline">{mockContent.type}</Badge>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {mockContent.duration}
              </span>
              <span>{new Date(mockContent.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Resources
              </Button>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on IPFS
              </Button>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {mockContent.content.sections.map((section, index) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {section.type === 'video' && <Play className="w-5 h-5" />}
                    {section.type === 'code' && <FileText className="w-5 h-5" />}
                    {section.type === 'text' && <FileText className="w-5 h-5" />}
                    {index + 1}. {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderContentSection(section)}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Content Footer */}
          <Card className="mt-12 bg-green-50 border-green-200">
            <CardContent className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Content Complete!
              </h3>
              <p className="text-green-600 mb-6">
                Thanks for being a subscriber. More exclusive content coming soon!
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href={`/creator/${mockContent.creator.id}`}>
                    More from {mockContent.creator.name}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/creators">
                    Discover More Creators
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
