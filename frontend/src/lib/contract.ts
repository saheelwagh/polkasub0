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
    // TEMPORARY: Mock creator profile from localStorage
    console.log('📋 Getting creator profile (mock):', address)
    
    try {
      const mockCreatorData = localStorage.getItem(`creator_${address}`)
      if (mockCreatorData) {
        const profile = JSON.parse(mockCreatorData)
        console.log('✅ Mock creator profile:', profile)
        return {
          name: profile.name,
          total_earned: profile.totalEarned,
          content_hash: profile.contentHash,
          created_at: profile.createdAt
        }
      }
      return null
    } catch (error) {
      console.error('Mock profile retrieval failed:', error)
      return null
    }
  }
  
  async isCreator(address: string): Promise<boolean> {
    // TEMPORARY: Mock creator check using localStorage
    console.log('🔍 Checking if creator exists (mock):', address)
    
    try {
      const mockCreator = localStorage.getItem(`creator_${address}`)
      const exists = !!mockCreator
      console.log('✅ Mock creator check result:', exists)
      return exists
    } catch (error) {
      console.error('Mock creator check failed:', error)
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
    // TEMPORARY: Mock registration until contract is properly deployed
    console.log('🚧 Using mock registration (contract deployment issue)')
    
    // Simulate contract call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Store registration in localStorage as mock
    const mockCreator = {
      name,
      address: signerAddress,
      totalEarned: 0,
      createdAt: Date.now(),
      contentHash: null
    }
    
    localStorage.setItem(`creator_${signerAddress}`, JSON.stringify(mockCreator))
    console.log('✅ Mock creator registered:', mockCreator)
    
    return { success: true, result: { ok: true } }
    
    /* REAL CONTRACT CODE (commented out until deployment fixed)
    if (!this.contract || !this.sdk) throw new Error('Contract not initialized')
    
    try {
      console.log('🔄 Registering creator:', name, 'from:', signerAddress)
      
      // Check contract deployment info
      console.log('📋 Contract deployment info:', {
        chainId: this.chainId,
        hasContract: !!this.contract,
        hasSdk: !!this.sdk
      })
      
      // Check if account is mapped (required for ink! contracts)
      const isMapped = await this.sdk.addressIsMapped(signerAddress)
      console.log('🗺️ Account mapping check result:', isMapped)
      if (!isMapped) {
        throw new Error("Account not mapped. Please map your account first using the Map Account button.")
      }
      
      // Note: We'll let the contract handle duplicate registration checks
      // since our query methods aren't working properly yet
      
      console.log('📤 Sending transaction with params:', {
        method: 'register_creator',
        origin: signerAddress,
        args: [name]
      })
      
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
        console.error('❌ Result.ok:', result.ok)
        console.error('❌ Result keys:', Object.keys(result))
        
        // Check events for more detailed error information
        if (result.events && Array.isArray(result.events)) {
          console.error('❌ Transaction events:', result.events.length, 'events found')
          console.error('❌ Events contain data but cannot be serialized (likely BigInt issue)')
        }
        
        // Check if we have txHash and block info
        if (result.txHash) {
          console.error('❌ Transaction hash:', result.txHash)
        }
        if (result.block) {
          console.error('❌ Block info:', result.block)
        }
        
        // Try to provide more helpful error messages
        let errorMessage = "Transaction failed"
        
        // Handle empty or undefined dispatch error
        if (!result.dispatchError || Object.keys(result.dispatchError).length === 0) {
          errorMessage = "Transaction failed with empty error. Common causes:\n" +
            "• Insufficient balance (need ~0.02 DOT for gas)\n" +
            "• Account not properly mapped\n" +
            "• Contract method not found\n" +
            "• Invalid parameters\n" +
            "Please check your balance and try again."
        } else if (result.dispatchError && typeof result.dispatchError === 'object') {
          if (result.dispatchError.type === 'Module' && result.dispatchError.value) {
            const moduleError = result.dispatchError.value
            if (moduleError.error === 0) {
              errorMessage = "Creator already exists - you are already registered!"
            } else {
              errorMessage = `Contract error: ${moduleError.error || 'unknown'} (index: ${moduleError.index || 'unknown'})`
            }
          } else if (result.dispatchError.type) {
            errorMessage = `Blockchain error: ${result.dispatchError.type}`
          } else {
            errorMessage = `Unknown dispatch error: ${String(result.dispatchError)}`
          }
        } else if (result.dispatchError) {
          errorMessage = `Transaction error: ${String(result.dispatchError)}`
        } else {
          errorMessage = "Transaction failed with unknown error - check console for details"
        }
        
        throw new Error(errorMessage, { cause: result.dispatchError })
      }
      
      return { success: true, result }
    } catch (error) {
      console.error('❌ Registration failed:', error)
      throw error
    }
    */
  }
}

// Note: Contract instances should be created with client and chainId from reactive-dot hooks
