"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button-extended"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea" // Component not found, using regular textarea
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, User, FileText, DollarSign, Upload, Wallet } from "lucide-react"
import { useAccounts, useClient, useChainId } from "@reactive-dot/react"
import { useSignerAndAddress } from "@/hooks/use-signer-and-address"
import { useWalletContext } from "@/components/providers/wallet-context"
import { CreatorTreasuryContract } from "@/lib/contract"
import { MapAccountDebug } from "@/components/web3/map-account-debug"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const accounts = useAccounts()
  const { signer, signerAddress } = useSignerAndAddress()
  const { account } = useWalletContext()
  const client = useClient()
  const chainId = useChainId()
  
  // Debug logging
  useEffect(() => {
    console.log("🔍 Registration Page Debug:")
    console.log("- accounts:", accounts)
    console.log("- signer:", signer)
    console.log("- signerAddress:", signerAddress)
    console.log("- wallet context account:", account)
  }, [accounts, signer, signerAddress, account])
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    monthlyRate: "5",
    tags: [] as string[],
    twitter: "",
    github: "",
    website: ""
  })
  const [currentTag, setCurrentTag] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [contract, setContract] = useState<CreatorTreasuryContract | null>(null)
  
  // Initialize contract
  useEffect(() => {
    const initContract = async () => {
      if (!client || !chainId) {
        console.log("⏳ Waiting for client and chainId...")
        return
      }
      
      console.log("🔗 Initializing contract...")
      console.log("- client:", client)
      console.log("- chainId:", chainId)
      
      const contractInstance = new CreatorTreasuryContract(client, chainId)
      const success = await contractInstance.initialize()
      if (success) {
        console.log("✅ Contract initialized successfully")
        console.log("🔍 Contract ready:", contractInstance.isReady())
        setContract(contractInstance)
      } else {
        console.error("❌ Contract initialization failed")
        toast.error("Failed to connect to contract")
      }
    }
    initContract()
  }, [client, chainId])

  const availableTags = [
    "Web3", "Polkadot", "Tutorials", "DeFi", "Research", "Analysis", 
    "Security", "Auditing", "ink!", "Parachains", "XCM", "Development",
    "Education", "Beginner", "Blockchain", "NFTs", "Art", "Digital"
  ]

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddTag = (tag: string) => {
    addTag(tag)
    setCurrentTag("")
  }

  const handleRemoveTag = (tag: string) => {
    removeTag(tag)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check for wallet connection from multiple sources
    const walletAddress = signerAddress || account?.address
    const walletSigner = signer || account?.polkadotSigner
    
    console.log("🚀 Registration attempt:")
    console.log("- walletAddress:", walletAddress)
    console.log("- walletSigner:", walletSigner)
    console.log("- contract:", contract)
    console.log("- contract ready:", contract?.isReady())
    
    if (!walletAddress) {
      toast.error("Please connect your wallet first")
      return
    }
    
    if (!walletSigner) {
      toast.error("Wallet signer not available. Please reconnect your wallet.")
      return
    }
    
    if (!contract || !contract.isReady()) {
      toast.error("Contract not initialized. Please refresh the page and try again.")
      return
    }

    setIsRegistering(true)
    
    try {
      toast.info("Registering creator on blockchain...")
      
      // Call the contract to register creator
      const result = await contract.registerCreator(formData.name, walletAddress, walletSigner)
      
      console.log("📝 Registration result:", result)
      
      if (result && result.success) {
        toast.success("Creator registration successful!")
        // Redirect to dashboard after successful registration
        router.push('/dashboard')
      } else {
        throw new Error("Registration transaction failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      
      // Handle specific error types
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes("Account not mapped")) {
        toast.error("Account needs to be mapped first. Click 'Map Account' button in the navbar.")
      } else if (errorMessage.includes("already registered")) {
        toast.error("You are already registered as a creator!")
      } else {
        toast.error(`Registration failed: ${errorMessage || "Unknown error"}`)
      }
    } finally {
      setIsRegistering(false)
    }
  }

  const isConnected = !!(signerAddress || account?.address)
  const isFormValid = formData.name && formData.bio && formData.monthlyRate && isConnected

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <main className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Become a Creator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start earning from your content with streaming crypto payments on Polkadot
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Registration Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Creator Profile
                  </CardTitle>
                  <CardDescription>
                    Set up your creator profile to start receiving streaming payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Wallet Connection */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Wallet Connection
                      </Label>
                      {!isConnected ? (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-700">
                            Please connect your Polkadot wallet using the navbar to register as a creator.
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-medium">Wallet Connected</span>
                          </div>
                          <p className="text-sm text-green-600 mt-1 font-mono">
                            {signerAddress || account?.address}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Account Mapping Status */}
                    {isConnected && (
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Account Mapping (Required for Transactions)
                        </Label>
                        <MapAccountDebug />
                      </div>
                    )}

                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Creator Name *</Label>
                        <Input
                          id="name"
                          placeholder="Your display name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!isConnected}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monthlyRate">Monthly Rate (DOT) *</Label>
                        <Input
                          id="monthlyRate"
                          type="number"
                          min="1"
                          step="0.1"
                          placeholder="5"
                          value={formData.monthlyRate}
                          onChange={(e) => setFormData(prev => ({ ...prev, monthlyRate: e.target.value }))}
                          disabled={!isConnected}
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio *</Label>
                      <textarea
                        id="bio"
                        placeholder="Tell potential subscribers about yourself and your content..."
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isConnected}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label>Content Tags (max 5)</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag(currentTag))}
                          disabled={!isConnected || formData.tags.length >= 5}
                        />
                        <Button
                          type="button"
                          onClick={() => handleAddTag(currentTag)}
                          disabled={!currentTag || formData.tags.length >= 5}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {availableTags.filter(tag => !formData.tags.includes(tag)).map((tag) => (
                          <Badge 
                            key={tag}
                            variant="outline"
                            className="cursor-pointer text-xs"
                            onClick={() => handleAddTag(tag)}
                          >
                            + {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                      <Label>Social Links (optional)</Label>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="twitter" className="text-sm">Twitter</Label>
                          <Input
                            id="twitter"
                            placeholder="https://twitter.com/username"
                            value={formData.twitter}
                            onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                            disabled={!isConnected}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="github" className="text-sm">GitHub</Label>
                          <Input
                            id="github"
                            placeholder="https://github.com/username"
                            value={formData.github}
                            onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                            disabled={!isConnected}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website" className="text-sm">Website</Label>
                          <Input
                            id="website"
                            placeholder="https://yoursite.com"
                            value={formData.website}
                            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                            disabled={!isConnected}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={!isFormValid || isRegistering}
                      className="w-full"
                      size="lg"
                    >
                      {isRegistering ? "Registering..." : "Register as Creator"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Info Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* How it Works */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How it Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Register Profile</p>
                      <p className="text-xs text-muted-foreground">Set up your creator profile with bio and pricing</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Upload Content</p>
                      <p className="text-xs text-muted-foreground">Add exclusive content for your subscribers</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Earn Streaming</p>
                      <p className="text-xs text-muted-foreground">Get paid every second from your subscribers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Creator Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Zero platform fees</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Instant streaming payments</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Full content ownership</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Decentralized platform</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Global crypto payments</span>
                  </div>
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
