import { createClient } from 'polkadot-api'
import { getWsProvider } from 'polkadot-api/ws-provider/web'
import { createInkSdk } from '@polkadot-api/sdk-ink'
import contractMetadata from './creator_treasury.json'

const CONTRACT_ADDRESS = '0xa51148989ed86b2b26e7b4dd3ea7ff08b95ae6d3'
const RPC_URL = 'wss://testnet-passet-hub.polkadot.io'

export class CreatorTreasuryContract {
  private client: any = null
  private sdk: any = null
  private contract: any = null
  
  async initialize() {
    try {
      // Create Polkadot API client
      this.client = createClient(getWsProvider(RPC_URL))
      
      // Create ink SDK and initialize the contract
      this.sdk = createInkSdk(this.client)
      this.contract = this.sdk.getContract(contractMetadata, CONTRACT_ADDRESS)
      
      console.log('✅ Contract connected to:', CONTRACT_ADDRESS)
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
      const result = await this.contract.query("getCreatorProfile", { origin: address }, address)
      return result.success ? result.value.response : null
    } catch (error) {
      console.error('Query failed:', error)
      return null
    }
  }
  
  async isCreator(address: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized')
    
    try {
      const result = await this.contract.query("isCreator", { origin: address }, address)
      return result.success ? result.value.response : false
    } catch (error) {
      console.error('Query failed:', error)
      return false
    }
  }
  
  // Transaction methods (cost gas)
  async registerCreator(name: string, signerAddress: string, signer: any) {
    if (!this.contract) throw new Error('Contract not initialized')
    
    try {
      console.log('🔄 Registering creator:', name, 'from:', signerAddress)
      
      const result = await this.contract.exec("registerCreator", { 
        origin: signerAddress,
        signer 
      }, name)
      
      console.log('✅ Registration transaction submitted:', result)
      return result
    } catch (error) {
      console.error('❌ Registration failed:', error)
      throw error
    }
  }
}

// Singleton instance
let contractInstance: CreatorTreasuryContract | null = null

export async function getContract(): Promise<CreatorTreasuryContract> {
  if (!contractInstance) {
    contractInstance = new CreatorTreasuryContract()
    await contractInstance.initialize()
  }
  return contractInstance
}
