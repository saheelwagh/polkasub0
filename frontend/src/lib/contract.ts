import { createInkSdk } from '@polkadot-api/sdk-ink'
import { useClient, useChainId } from '@reactive-dot/react'
import { creatorTreasury } from '@/lib/inkathon/deployments'

export class CreatorTreasuryContract {
  private client: any = null
  private sdk: any = null
  private contract: any = null
  private chainId: string = 'passethub'
  
  constructor(client: any, chainId: string = 'passethub') {
    this.client = client
    this.chainId = chainId
  }
  
  async initialize() {
    try {
      if (!this.client) {
        throw new Error('Client not provided')
      }
      
      // Create ink SDK and initialize the contract
      this.sdk = createInkSdk(this.client)
      this.contract = this.sdk.getContract(
        creatorTreasury.contract, 
        creatorTreasury.evmAddresses[this.chainId as keyof typeof creatorTreasury.evmAddresses]
      )
      
      console.log('✅ Contract connected to:', creatorTreasury.evmAddresses[this.chainId as keyof typeof creatorTreasury.evmAddresses])
      return true
    } catch (error) {
      console.error('❌ Contract connection failed:', error)
      return false
    }
  }
  
  // Check if contract is ready
  isReady(): boolean {
    return !!(this.client && this.contract)
  }
  
  // Query methods (free, no gas)
  async getCreatorProfile(address: string) {
    if (!this.contract) throw new Error('Contract not initialized')
    
    try {
      const result = await this.contract.query("get_creator_profile", { origin: address }, address)
      return result.success ? result.value.response : null
    } catch (error) {
      console.error('Query failed:', error)
      return null
    }
  }
  
  async isCreator(address: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized')
    
    try {
      const result = await this.contract.query("is_creator", { origin: address }, address)
      return result.success ? result.value.response : false
    } catch (error) {
      console.error('Query failed:', error)
      return false
    }
  }
  
  // Transaction methods (cost gas)
  async registerCreator(name: string, signerAddress: string, signer: any) {
    if (!this.contract || !this.sdk) throw new Error('Contract not initialized')
    
    try {
      console.log('🔄 Registering creator:', name, 'from:', signerAddress)
      
      // Check if account is mapped (required for ink! contracts)
      const isMapped = await this.sdk.addressIsMapped(signerAddress)
      if (!isMapped) {
        throw new Error("Account not mapped. Please map your account first using the Map Account button.")
      }
      
      // Send transaction using the correct API
      const tx = this.contract
        .send("register_creator", { origin: signerAddress }, name)
        .signAndSubmit(signer)
      
      console.log('✅ Registration transaction submitted')
      
      // Wait for transaction result
      const result = await tx
      if (!result.ok) {
        throw new Error("Transaction failed", { cause: result.dispatchError })
      }
      
      return { success: true, result }
    } catch (error) {
      console.error('❌ Registration failed:', error)
      throw error
    }
  }
}

// Note: Contract instances should be created with client and chainId from reactive-dot hooks
