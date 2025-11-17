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
    if (!this.contract || !this.sdk) throw new Error('Contract not initialized')
    
    try {
      // Use pre-mapped Alice account for queries (workaround for unmapped accounts)
      const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
      
      // Check if Alice is mapped, if not, use storage directly
      const isAliceMapped = await this.sdk.addressIsMapped(ALICE)
      if (isAliceMapped) {
        const result = await this.contract.query("get_creator_profile", { origin: ALICE }, address)
        return result.success ? result.value.response : null
      } else {
        console.warn('Using storage fallback for getCreatorProfile - Alice not mapped')
        // For now, return null - we'll implement storage queries later
        return null
      }
    } catch (error) {
      console.error('Query failed:', error)
      return null
    }
  }
  
  async isCreator(address: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized')
    
    try {
      console.log('🔍 Checking if creator exists:', address)
      
      // Use direct storage access instead of contract queries
      // This avoids the account mapping requirement
      const storageResult = await this.contract.getStorage()
      console.log('📦 Storage result:', storageResult)
      
      // For now, we'll assume the user is not a creator and let the transaction fail
      // with a proper error message if they're already registered
      // This is a temporary workaround until we can properly read storage
      console.warn('⚠️ Using fallback: assuming user is not a creator')
      return false
      
    } catch (error) {
      console.error('Query failed:', error)
      return false
    }
  }
  
  async getCreatorCount(): Promise<number> {
    if (!this.contract || !this.sdk) throw new Error('Contract not initialized')
    
    try {
      // Use pre-mapped Alice account for queries
      const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
      
      const isAliceMapped = await this.sdk.addressIsMapped(ALICE)
      if (isAliceMapped) {
        const result = await this.contract.query("get_creator_count", { origin: ALICE })
        return result.success ? result.value.response : 0
      } else {
        console.warn('Using storage fallback for getCreatorCount - Alice not mapped')
        return 0
      }
    } catch (error) {
      console.error('Query failed:', error)
      return 0
    }
  }
  
  // Utility methods
  async mapAccount(signerAddress: string, signer: any) {
    if (!this.sdk) throw new Error('SDK not initialized')
    
    try {
      console.log('🗺️ Mapping account:', signerAddress)
      const result = await this.sdk.mapAccount(signerAddress, signer)
      console.log('✅ Account mapped successfully:', result)
      return result
    } catch (error) {
      console.error('❌ Account mapping failed:', error)
      throw error
    }
  }
  
  async isAccountMapped(address: string): Promise<boolean> {
    if (!this.sdk) throw new Error('SDK not initialized')
    
    try {
      return await this.sdk.addressIsMapped(address)
    } catch (error) {
      console.error('Failed to check if account is mapped:', error)
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
      
      // Note: We'll let the contract handle duplicate registration checks
      // since our query methods aren't working properly yet
      
      // Send transaction using the correct API
      const tx = this.contract
        .send("register_creator", { origin: signerAddress }, name)
        .signAndSubmit(signer)
      
      console.log('✅ Registration transaction submitted')
      
      // Wait for transaction result
      const result = await tx
      console.log('📋 Transaction result:', result)
      
      if (!result.ok) {
        console.error('❌ Transaction dispatch error:', result.dispatchError)
        
        // Try to provide more helpful error messages
        let errorMessage = "Transaction failed"
        if (result.dispatchError && typeof result.dispatchError === 'object') {
          if (result.dispatchError.type === 'Module' && result.dispatchError.value) {
            const moduleError = result.dispatchError.value
            if (moduleError.error === 0) {
              errorMessage = "Creator already exists - you are already registered!"
            } else {
              errorMessage = `Contract error: ${moduleError.error} (index: ${moduleError.index})`
            }
          } else if (result.dispatchError.type) {
            errorMessage = `Blockchain error: ${result.dispatchError.type}`
          }
        } else if (result.dispatchError) {
          errorMessage = `Transaction error: ${String(result.dispatchError)}`
        }
        
        throw new Error(errorMessage, { cause: result.dispatchError })
      }
      
      return { success: true, result }
    } catch (error) {
      console.error('❌ Registration failed:', error)
      throw error
    }
  }
}

// Note: Contract instances should be created with client and chainId from reactive-dot hooks
