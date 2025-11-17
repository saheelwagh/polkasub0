# 🚀 Creator Treasury Integration Sprint Plan

**Sprint Goal**: Integrate deployed smart contract with React frontend  
**Contract Address**: `0xa51148989ed86b2b26e7b4dd3ea7ff08b95ae6d3`  
**Network**: Passet Hub Testnet  
**Duration**: 2-3 hours

---

## 📋 **Pre-Integration Checklist**

- ✅ **Contract deployed** to testnet (passet)
- ✅ **All unit tests passing** (8/8)
- ✅ **Gas estimates confirmed**
- ✅ **Frontend pages implemented**
- ✅ **Web3 providers configured**

---

## 🔗 **Contract ↔ Frontend Integration Mapping**

### **1. Creator Registration Flow**

#### **Contract Function**: `register_creator(name: String)`

- **Location**: `/contracts/src/creator_treasury/lib.rs:259-280`
- **Purpose**: Register new creator on platform

#### **Frontend Integration**:

- **Page**: `/frontend/src/app/register/page.tsx`
- **Component Lines**: 89-120 (form submission handler)
- **Current Code**:

```typescript
// Line 89-95: Mock registration
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  // TODO: Replace with actual contract call
  await new Promise(resolve => setTimeout(resolve, 2000))
```

#### **Integration Changes Needed**:

```typescript
// Replace mock with contract call
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  try {
    await contract.tx.registerCreator(formData.name).signAndSend(account, (result) => {
      if (result.status.isInBlock) {
        setIsLoading(false)
        router.push('/dashboard')
      }
    })
  } catch (error) {
    setError('Registration failed')
    setIsLoading(false)
  }
}
```

---

### **2. Creator Discovery & Profiles**

#### **Contract Functions**:

- `get_creator_list()` - Line 709-742
- `is_creator(creator: AccountId)` - Line 744-748
- `get_creator_profile(creator: AccountId)` - Line 750-754

#### **Frontend Integration**:

- **Page**: `/frontend/src/app/creators/page.tsx`
- **Mock Data**: Lines 8-47 (`mockCreators` array)
- **Component**: Lines 49-203 (creator cards rendering)

#### **Integration Changes**:

```typescript
// Replace mockCreators with contract data
const [creators, setCreators] = useState([])

useEffect(() => {
  async function loadCreators() {
    try {
      // Note: get_creator_list returns empty for now (line 742)
      // Alternative: maintain creator list in frontend state
      const creatorList = await contract.query.getCreatorList()

      // For each creator, fetch profile
      const profiles = await Promise.all(
        creatorList.map(async (address) => {
          const profile = await contract.query.getCreatorProfile(address)
          return { address, ...profile }
        }),
      )
      setCreators(profiles)
    } catch (error) {
      console.error('Failed to load creators:', error)
    }
  }
  loadCreators()
}, [])
```

---

### **3. Individual Creator Profile**

#### **Contract Functions**:

- `get_creator_profile(creator: AccountId)` - Line 750-754
- `get_creator_content(creator: AccountId)` - Line 656-695
- `get_subscription(fan: AccountId, creator: AccountId)` - Line 756-760

#### **Frontend Integration**:

- **Page**: `/frontend/src/app/creator/[address]/page.tsx`
- **Mock Data**: Lines 8-32 (single creator object)
- **Subscription Logic**: Lines 34-45 (`handleSubscribe` function)

#### **Integration Changes**:

```typescript
// Replace mock data with contract queries
const [creator, setCreator] = useState(null)
const [subscription, setSubscription] = useState(null)
const [content, setContent] = useState(null)

useEffect(() => {
  async function loadCreatorData() {
    try {
      // Load creator profile
      const profile = await contract.query.getCreatorProfile(params.address)
      setCreator(profile)

      // Check if user is subscribed
      if (account) {
        const sub = await contract.query.getSubscription(account.address, params.address)
        setSubscription(sub)

        // If subscribed, load exclusive content
        if (sub) {
          const contentHash = await contract.query.getCreatorContent(params.address)
          setContent(contentHash)
        }
      }
    } catch (error) {
      console.error('Failed to load creator data:', error)
    }
  }
  loadCreatorData()
}, [params.address, account])
```

---

### **4. Subscription Management**

#### **Contract Functions**:

- `subscribe(creator: AccountId, monthly_rate: u128)` - Line 282-349
- `cancel_subscription(creator: AccountId)` - Line 512-578
- `get_subscription(fan: AccountId, creator: AccountId)` - Line 756-760

#### **Frontend Integration**:

- **Page**: `/frontend/src/app/creator/[address]/page.tsx`
- **Subscribe Handler**: Lines 34-45
- **Subscription Page**: `/frontend/src/app/subscriptions/page.tsx`

#### **Integration Changes**:

**Subscribe Function** (creator profile page):

```typescript
// Line 34-45: Replace mock subscription
const handleSubscribe = async () => {
  if (!account) return

  setIsLoading(true)
  try {
    const monthlyRate = creator.monthlyRate * 1e12 // Convert to Planck

    await contract.tx
      .subscribe(creator.address, monthlyRate)
      .signAndSend(account, { value: monthlyRate }, (result) => {
        if (result.status.isInBlock) {
          setIsSubscribed(true)
          setIsLoading(false)
        }
      })
  } catch (error) {
    console.error('Subscription failed:', error)
    setIsLoading(false)
  }
}
```

**Subscriptions Management Page**:

```typescript
// Load user's subscriptions
const [subscriptions, setSubscriptions] = useState([])

useEffect(() => {
  async function loadSubscriptions() {
    if (!account) return

    try {
      // Get all creators and check subscriptions
      const creators = await contract.query.getCreatorList()
      const userSubs = []

      for (const creatorAddress of creators) {
        const sub = await contract.query.getSubscription(account.address, creatorAddress)
        if (sub) {
          const profile = await contract.query.getCreatorProfile(creatorAddress)
          userSubs.push({ creator: profile, subscription: sub })
        }
      }
      setSubscriptions(userSubs)
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
    }
  }
  loadSubscriptions()
}, [account])
```

---

### **5. Creator Dashboard & Earnings**

#### **Contract Functions**:

- `claim_earnings(fan: AccountId)` - Line 409-509
- `get_creator_profile(creator: AccountId)` - Line 750-754
- `add_exclusive_content(content_hash: String)` - Line 580-654

#### **Frontend Integration**:

- **Page**: `/frontend/src/app/dashboard/page.tsx`
- **Mock Data**: Lines 8-47 (earnings, subscribers, content)
- **Claim Earnings**: Lines 49-60

#### **Integration Changes**:

```typescript
// Replace mock dashboard data
const [earnings, setEarnings] = useState(0)
const [subscribers, setSubscribers] = useState([])
const [profile, setProfile] = useState(null)

useEffect(() => {
  async function loadDashboardData() {
    if (!account) return

    try {
      // Load creator profile
      const creatorProfile = await contract.query.getCreatorProfile(account.address)
      setProfile(creatorProfile)
      setEarnings(creatorProfile.total_earned)

      // Load subscribers (iterate through all users - expensive!)
      // Better: maintain subscriber list in contract or off-chain
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    }
  }
  loadDashboardData()
}, [account])

// Claim earnings function
const handleClaimEarnings = async (fanAddress: string) => {
  try {
    await contract.tx.claimEarnings(fanAddress).signAndSend(account, (result) => {
      if (result.status.isInBlock) {
        // Refresh earnings data
        loadDashboardData()
      }
    })
  } catch (error) {
    console.error('Claim failed:', error)
  }
}
```

---

### **6. Content Management**

#### **Contract Functions**:

- `add_exclusive_content(content_hash: String)` - Line 580-654
- `get_creator_content(creator: AccountId)` - Line 656-695

#### **Frontend Integration**:

- **Dashboard**: Content upload section (lines 200-250)
- **Creator Profile**: Content display (lines 150-200)

#### **Integration Changes**:

```typescript
// Content upload (dashboard)
const handleContentUpload = async (file: File) => {
  try {
    // 1. Upload to IPFS (use Pinata, Web3.Storage, etc.)
    const ipfsHash = await uploadToIPFS(file)

    // 2. Store hash in contract
    await contract.tx.addExclusiveContent(ipfsHash).signAndSend(account, (result) => {
      if (result.status.isInBlock) {
        console.log('Content uploaded successfully')
      }
    })
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

// Content access (creator profile)
const loadContent = async () => {
  if (isSubscribed) {
    try {
      const contentHash = await contract.query.getCreatorContent(creator.address)
      // Download from IPFS using hash
      const contentUrl = `https://ipfs.io/ipfs/${contentHash}`
      setContentUrl(contentUrl)
    } catch (error) {
      console.error('Content access denied:', error)
    }
  }
}
```

---

## 🔧 **Technical Integration Setup**

### **1. Contract Connection Setup**

**File**: `/frontend/src/lib/contract.ts` (create new)

```typescript
import { ApiPromise, WsProvider } from '@polkadot/api'
import { ContractPromise } from '@polkadot/api-contract'
import contractMetadata from './creator_treasury.json' // Copy from contract build

const CONTRACT_ADDRESS = '0xa51148989ed86b2b26e7b4dd3ea7ff08b95ae6d3'
const RPC_URL = 'wss://testnet-passet-hub.polkadot.io'

export class CreatorTreasuryContract {
  private api: ApiPromise
  private contract: ContractPromise

  async initialize() {
    const provider = new WsProvider(RPC_URL)
    this.api = await ApiPromise.create({ provider })
    this.contract = new ContractPromise(this.api, contractMetadata, CONTRACT_ADDRESS)
  }

  // Query methods (free, no gas)
  async getCreatorProfile(address: string) {
    const { result, output } = await this.contract.query.getCreatorProfile(
      address,
      { gasLimit: -1 },
      address,
    )
    return output?.toHuman()
  }

  // Transaction methods (cost gas)
  async registerCreator(name: string, signer: any) {
    return this.contract.tx.registerCreator({ gasLimit: -1 }, name).signAndSend(signer)
  }

  async subscribe(creator: string, monthlyRate: number, signer: any) {
    return this.contract.tx
      .subscribe({ gasLimit: -1, value: monthlyRate }, creator, monthlyRate)
      .signAndSend(signer)
  }

  // Add other methods...
}
```

### **2. Update Web3 Context**

**File**: `/frontend/src/components/layout/navbar.tsx`
**Lines to modify**: 15-30 (Web3 provider setup)

```typescript
// Add contract instance to context
const [contract, setContract] = useState<CreatorTreasuryContract | null>(null)

useEffect(() => {
  async function initContract() {
    const contractInstance = new CreatorTreasuryContract()
    await contractInstance.initialize()
    setContract(contractInstance)
  }
  initContract()
}, [])
```

### **3. Copy Contract Metadata**

**Action Required**:

1. Copy `/contracts/target/ink/creator_treasury/creator_treasury.json`
2. To `/frontend/src/lib/creator_treasury.json`
3. This contains ABI for contract interaction

---

## 📅 **Integration Sprint Timeline**

### **Phase 1: Setup (30 minutes)**

- [ ] Create contract connection utilities
- [ ] Copy contract metadata to frontend
- [ ] Update Web3 context with contract instance
- [ ] Test basic contract connection

### **Phase 2: Core Functions (60 minutes)**

- [ ] Integrate creator registration
- [ ] Replace mock creator data with contract queries
- [ ] Implement subscription flow
- [ ] Add error handling and loading states

### **Phase 3: Advanced Features (45 minutes)**

- [ ] Integrate earnings dashboard
- [ ] Add content upload/access
- [ ] Implement subscription management
- [ ] Add real-time updates

### **Phase 4: Testing & Polish (30 minutes)**

- [ ] Test all flows end-to-end
- [ ] Add proper error messages
- [ ] Optimize gas usage
- [ ] Add transaction confirmations

---

## ⚠️ **Known Limitations & Workarounds**

### **1. Creator List Function**

- **Issue**: `get_creator_list()` returns empty (line 742 in contract)
- **Workaround**: Maintain creator addresses in frontend state or use events

### **2. Subscriber Discovery**

- **Issue**: No direct way to get all subscribers of a creator
- **Workaround**: Listen to subscription events or maintain off-chain index

### **3. Gas Optimization**

- **Issue**: Multiple contract calls can be expensive
- **Workaround**: Batch queries where possible, cache results

---

## 🎯 **Success Metrics**

- [ ] **Creator Registration**: New creators can register via frontend
- [ ] **Subscription Flow**: Users can subscribe and pay with real DOT
- [ ] **Earnings Claims**: Creators can claim vested earnings
- [ ] **Content Gating**: Exclusive content only accessible to subscribers
- [ ] **Real-time Updates**: UI reflects blockchain state changes

---

## 🚀 **Post-Integration Next Steps**

1. **Deploy to Production**: Move to Polkadot mainnet
2. **Add IPFS Integration**: For decentralized content storage
3. **Implement Events**: Real-time notifications
4. **Add Analytics**: Creator earnings tracking
5. **Mobile Optimization**: Responsive design improvements

---

**Ready to start integration!** 🎉 All contract functions are deployed and tested. Frontend modifications will handle any interface mismatches.
