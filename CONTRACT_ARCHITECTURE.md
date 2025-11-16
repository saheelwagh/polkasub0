# 🏗️ Creator Treasury Contract Architecture

## Overview

Our **Creator Treasury** is a single smart contract that handles all functionality:

- Creator registration and profiles
- Subscription management with streaming payments
- Time-based vesting calculations
- Content access control
- Earnings claims and refunds

---

## 📁 Contract Structure

### **Single Contract Approach**

We use **one contract** instead of multiple because:

- ✅ **Simpler deployment** - only one address to manage
- ✅ **Lower gas costs** - no cross-contract calls
- ✅ **Easier frontend integration** - single contract interface
- ✅ **Atomic operations** - all data in one place

---

## 🗂️ Data Structures

### **CreatorProfile** - Stores creator information

```rust
#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct CreatorProfile {
    /// Creator's display name (e.g., "Alex Chen")
    pub name: String,

    /// IPFS hash of creator's exclusive content
    /// Example: "QmX7M9CiYXjVQX8Z2..."
    pub content_hash: Option<String>,

    /// Total DOT earned by this creator (for display)
    pub total_earned: Balance,

    /// When this creator registered (timestamp)
    pub created_at: u64,
}
```

### **Subscription** - Tracks fan-to-creator subscriptions

```rust
#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub struct Subscription {
    /// Total DOT deposited by fan for this subscription
    pub total_deposited: Balance,

    /// How much DOT streams per second to creator
    /// Calculated as: monthly_rate / (30 * 24 * 60 * 60)
    pub rate_per_second: Balance,

    /// Last time creator claimed earnings (timestamp)
    pub last_claim_time: u64,

    /// When subscription started (timestamp)
    pub start_time: u64,
}
```

### **Contract Storage** - Main contract state

```rust
#[ink(storage)]
pub struct CreatorTreasury {
    /// Maps creator address → their profile
    /// Example: 5GrwvaEF... → CreatorProfile { name: "Alex Chen", ... }
    creators: Mapping<AccountId, CreatorProfile>,

    /// Maps (fan_address, creator_address) → subscription details
    /// Example: (5HpG9w8..., 5GrwvaEF...) → Subscription { total_deposited: 5000000000000, ... }
    subscriptions: Mapping<(AccountId, AccountId), Subscription>,

    /// Total number of registered creators (for frontend display)
    creator_count: u32,
}
```

---

## 🔧 Contract Functions

### **Constructor** - Initialize contract

```rust
#[ink(constructor)]
pub fn new() -> Self {
    /// Called once when contract is deployed
    /// Sets up empty storage mappings
    /// No parameters needed for our simple case
}
```

### **Creator Management**

#### **register_creator()** - Creator joins platform

```rust
#[ink(message)]
pub fn register_creator(&mut self, name: String) -> Result<(), Error>
```

**What it does:**

1. Checks if creator already registered (prevent duplicates)
2. Creates new `CreatorProfile` with provided name
3. Stores profile in `creators` mapping
4. Increments `creator_count`
5. Emits `CreatorRegistered` event

**Frontend usage:** "Become a Creator" button

#### **get_creator_list()** - Get all creators

```rust
#[ink(message)]
pub fn get_creator_list(&self) -> Vec<(AccountId, CreatorProfile)>
```

**What it does:**

1. Iterates through all creators in storage
2. Returns list of (address, profile) pairs
3. Frontend uses this to display creator cards

**Frontend usage:** Creator discovery page

### **Subscription Management**

#### **subscribe()** - Fan subscribes to creator

```rust
#[ink(message, payable)]
pub fn subscribe(&mut self, creator: AccountId, monthly_rate: Balance) -> Result<(), Error>
```

**What it does:**

1. Receives DOT payment from fan (`payable` function)
2. Calculates `rate_per_second = monthly_rate / 2_592_000` (30 days in seconds)
3. Creates new `Subscription` record
4. Stores in `subscriptions` mapping with key `(fan, creator)`
5. Emits `SubscriptionCreated` event

**Frontend usage:** "Subscribe" button on creator profile

#### **cancel_subscription()** - Fan cancels subscription

```rust
#[ink(message)]
pub fn cancel_subscription(&mut self, creator: AccountId) -> Result<Balance, Error>
```

**What it does:**

1. Gets subscription details for `(caller, creator)`
2. Calculates time elapsed since subscription started
3. Calculates vested amount: `elapsed_time * rate_per_second`
4. Calculates refund: `total_deposited - vested_amount`
5. Transfers refund back to fan
6. Deletes subscription from storage
7. Returns refund amount

**Frontend usage:** "Cancel Subscription" button

### **Earnings Management**

#### **claim_earnings()** - Creator claims vested earnings

```rust
#[ink(message)]
pub fn claim_earnings(&mut self, fan: AccountId) -> Result<Balance, Error>
```

**What it does:**

1. Gets subscription details for `(fan, creator)`
2. Calculates time since last claim
3. Calculates vested amount: `time_diff * rate_per_second`
4. Ensures not claiming more than available balance
5. Transfers vested DOT to creator
6. Updates `last_claim_time` to now
7. Updates creator's `total_earned`
8. Returns claimed amount

**Frontend usage:** "Claim Earnings" button on dashboard

### **Content Access Control**

#### **add_exclusive_content()** - Creator uploads content

```rust
#[ink(message)]
pub fn add_exclusive_content(&mut self, content_hash: String) -> Result<(), Error>
```

**What it does:**

1. Verifies caller is registered creator
2. Updates creator's `content_hash` field
3. Emits `ContentAdded` event

**Frontend usage:** "Add Content" form on dashboard

#### **get_creator_content()** - Check content access

```rust
#[ink(message)]
pub fn get_creator_content(&self, creator: AccountId) -> Result<String, Error>
```

**What it does:**

1. Checks if caller has active subscription to creator
2. If subscribed: returns creator's `content_hash`
3. If not subscribed: returns error "Subscription required"

**Frontend usage:** Content gating logic on creator profile

---

## 📊 Events (Blockchain Notifications)

### **CreatorRegistered** - New creator joins

```rust
#[ink(event)]
pub struct CreatorRegistered {
    #[ink(topic)]
    creator: AccountId,
    name: String,
}
```

**Frontend use:** Update creator list in real-time

### **SubscriptionCreated** - Fan subscribes

```rust
#[ink(event)]
pub struct SubscriptionCreated {
    #[ink(topic)]
    fan: AccountId,
    #[ink(topic)]
    creator: AccountId,
    monthly_rate: Balance,
    total_deposited: Balance,
}
```

**Frontend use:** Show subscription confirmation

### **EarningsClaimed** - Creator claims earnings

```rust
#[ink(event)]
pub struct EarningsClaimed {
    #[ink(topic)]
    creator: AccountId,
    #[ink(topic)]
    fan: AccountId,
    amount: Balance,
}
```

**Frontend use:** Update earnings display

### **SubscriptionCancelled** - Fan cancels

```rust
#[ink(event)]
pub struct SubscriptionCancelled {
    #[ink(topic)]
    fan: AccountId,
    #[ink(topic)]
    creator: AccountId,
    refund_amount: Balance,
}
```

**Frontend use:** Show cancellation confirmation

---

## 🔄 Compilation Process

### **Step 1: Build Contract**

```bash
cd contracts/src/creator_treasury
cargo contract build
```

**Output:**

- `target/ink/creator_treasury.contract` - Deployable contract
- `target/ink/creator_treasury.wasm` - WebAssembly bytecode
- `target/ink/metadata.json` - Contract interface description

### **Step 2: Generate TypeScript Types**

```bash
cd contracts
npm run codegen
```

**Output:**

- `deployments/creator_treasury/metadata.json` - Contract ABI
- TypeScript type definitions for frontend

### **Step 3: Deploy Contract**

```bash
cargo contract instantiate \
  --constructor new \
  --url wss://shibuya-rpc.dwellir.com \
  --suri "your mnemonic phrase"
```

**Output:**

- Contract address (e.g., `5GH8vQKQJH...`)
- Deployment transaction hash

---

## 🌐 Frontend Integration

### **Contract Connection**

```typescript
// Connect to deployed contract
import { CONTRACT_ADDRESS } from './config'
import metadata from './metadata.json'

const contract = new Contract(CONTRACT_ADDRESS, metadata, api)
```

### **Calling Contract Functions**

#### **Read-only calls (Queries)**

```typescript
// Get creator list (free, no transaction)
const creators = await contract.query.getCreatorList()
```

#### **State-changing calls (Messages)**

```typescript
// Register as creator (costs gas, needs signature)
await contract.tx.registerCreator('Alex Chen').signAndSend(account, (result) => {
  if (result.status.isInBlock) {
    console.log('Creator registered!')
  }
})
```

#### **Payable calls (Send DOT)**

```typescript
// Subscribe to creator (send 5 DOT)
const monthlyRate = 5 * 1e12 // 5 DOT in Planck units
await contract.tx
  .subscribe(creatorAddress, monthlyRate)
  .signAndSend(account, { value: monthlyRate })
```

### **Event Listening**

```typescript
// Listen for new creator registrations
contract.events.CreatorRegistered((event) => {
  console.log(`New creator: ${event.name}`)
  // Update UI to show new creator
})
```

---

## 🧮 Vesting Math Explained

### **Time-based Streaming**

Our contract implements **per-second vesting**:

```rust
// If fan pays 5 DOT/month:
let monthly_rate = 5_000_000_000_000; // 5 DOT in Planck units
let rate_per_second = monthly_rate / 2_592_000; // 30 days = 2,592,000 seconds

// After 1 hour (3600 seconds):
let vested_amount = 3600 * rate_per_second;
// = 3600 * (5 DOT / 2,592,000)
// = 0.00694 DOT vested
```

### **Claim Calculation**

```rust
// When creator claims earnings:
let current_time = self.env().block_timestamp();
let time_since_last_claim = current_time - subscription.last_claim_time;
let vested_amount = time_since_last_claim * subscription.rate_per_second;

// Ensure we don't claim more than available
let available_balance = subscription.total_deposited - already_claimed;
let claimable = min(vested_amount, available_balance);
```

### **Refund Calculation**

```rust
// When fan cancels subscription:
let elapsed_time = current_time - subscription.start_time;
let total_vested = elapsed_time * subscription.rate_per_second;
let refund_amount = subscription.total_deposited - total_vested;
```

---

## 🛡️ Security Considerations

### **Access Control**

- Only creators can add content to their profile
- Only subscribers can access creator content
- Only subscription parties can claim/cancel

### **Overflow Protection**

- Use `saturating_add()` and `saturating_sub()` for math
- Check balances before transfers
- Validate input parameters

### **Reentrancy Protection**

- Update state before external calls
- Use `transfer()` instead of `call()` for DOT transfers

---

## 🎯 Testing Strategy

### **Unit Tests**

```rust
#[cfg(test)]
mod tests {
    #[ink::test]
    fn test_creator_registration() {
        let mut contract = CreatorTreasury::new();
        assert!(contract.register_creator("Alice".to_string()).is_ok());
    }

    #[ink::test]
    fn test_subscription_flow() {
        // Test full subscribe → vest → claim → cancel flow
    }
}
```

### **Integration Tests**

- Deploy to local Substrate node
- Test with Polkadot.js Apps
- Verify events are emitted correctly
- Test edge cases (zero balances, time boundaries)

---

This architecture provides a solid foundation for our decentralized Patreon! 🚀
