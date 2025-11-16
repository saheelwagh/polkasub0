# 🚀 Sprint 2: Subscription Logic & Vesting Math

## 🎯 **Sprint 2 Goals (90 minutes)**

### **Objective**: Implement time-based vesting and complete subscription lifecycle

### **Core Features to Add**:

1. **claim_earnings()** - Time-based vesting calculations
2. **cancel_subscription()** - Instant refunds for unused time
3. **add_exclusive_content()** - Creator content upload
4. **get_creator_content()** - Content gating logic
5. **get_creator_list()** - Optimize creator discovery

---

## 📊 **Sprint 1 Achievements**

### ✅ **Completed**:

- **Contract foundation** with Pop CLI integration
- **Creator registration** (`register_creator()`)
- **Basic subscription** (`subscribe()` payable function)
- **Profile queries** (`get_creator_profile()`, `is_creator()`)
- **Comprehensive Web3 documentation** for beginners
- **Event system** for frontend notifications
- **Unit test framework** setup

### ✅ **Infrastructure Ready**:

- **Pop CLI working** (v0.11.0)
- **Frontend Web3 setup** for Passet Hub testnet
- **PAS tokens available** for deployment
- **ReactiveDOT integration** complete

---

## 🔧 **Sprint 2 Implementation Plan**

### **Task 1: Time-Based Vesting (25 min)**

**Function**: `claim_earnings(fan: AccountId) -> Result<u128, Error>`

**Key Concepts**:

- **Per-second streaming**: Calculate vested amount based on elapsed time
- **Timestamp math**: `(current_time - last_claim_time) * rate_per_second`
- **Balance tracking**: Prevent over-claiming, update subscription state
- **DOT transfers**: Move vested tokens from contract to creator wallet

**Implementation**:

```rust
// Calculate time elapsed since last claim
let time_elapsed = now - subscription.last_claim_time;
let seconds_elapsed = time_elapsed / 1000; // Convert ms to seconds
let vested_amount = seconds_elapsed as u128 * subscription.rate_per_second;

// Ensure not claiming more than available
let claimable = min(vested_amount, subscription.total_deposited);

// Transfer DOT to creator
self.env().transfer(creator, claimable_amount)?;
```

### **Task 2: Subscription Cancellation (20 min)**

**Function**: `cancel_subscription(creator: AccountId) -> Result<u128, Error>`

**Key Concepts**:

- **Refund calculation**: `total_deposited - (elapsed_time * rate_per_second)`
- **Fair refunds**: Only charge for time actually elapsed
- **State cleanup**: Remove subscription from storage
- **Access control**: Only subscriber can cancel

**Implementation**:

```rust
// Calculate total time elapsed since subscription started
let total_elapsed = now - subscription.start_time;
let total_vested = (total_elapsed / 1000) as u128 * subscription.rate_per_second;

// Calculate refund (what hasn't vested yet)
let refund_amount = subscription.total_deposited.saturating_sub(total_vested);

// Remove subscription and refund fan
self.subscriptions.remove(subscription_key);
self.env().transfer(fan, refund_amount)?;
```

### **Task 3: Content Management (25 min)**

**Functions**:

- `add_exclusive_content(content_hash: String) -> Result<(), Error>`
- `get_creator_content(creator: AccountId) -> Result<String, Error>`

**Key Concepts**:

- **IPFS integration**: Store content hashes, not actual content
- **Access control**: Only creators can add content
- **Content gating**: Only subscribers can access content
- **Subscription verification**: Check active subscription status

**Implementation**:

```rust
// Content upload (creator only)
let mut profile = self.creators.get(creator).ok_or(Error::CreatorNotFound)?;
profile.content_hash = Some(content_hash.clone());
self.creators.insert(creator, &profile);

// Content access (subscribers only)
let subscription_key = (fan, creator);
if !self.subscriptions.contains(subscription_key) {
    return Err(Error::SubscriptionRequired);
}
```

### **Task 4: Creator Discovery Optimization (15 min)**

**Function**: `get_creator_list() -> Vec<(AccountId, CreatorProfile)>`

**Key Concepts**:

- **Storage iteration**: Efficient way to return all creators
- **Pagination**: Handle large numbers of creators
- **Gas optimization**: Limit results to prevent transaction failures

### **Task 5: Testing & Documentation (5 min)**

- **Unit tests** for all new functions
- **Integration tests** for complete flows
- **Update Web3 concepts** with new patterns

---

## 🧮 **New Web3 Concepts in Sprint 2**

### **1. Time-Based Vesting**

**Concept**: Gradual release of funds over time

```rust
// Streaming payment calculation
let rate_per_second = monthly_amount / (30 * 24 * 60 * 60);
let vested_amount = elapsed_seconds * rate_per_second;
```

**Real-world analogy**: Like a salary that accumulates every second rather than being paid monthly

### **2. Blockchain Time**

**Concept**: Using block timestamps for time calculations

```rust
let now = self.env().block_timestamp(); // Milliseconds since Unix epoch
```

**Key points**:

- **Block time**: ~6 seconds on Polkadot
- **Timestamp accuracy**: Good enough for subscription billing
- **Immutable time**: Can't be manipulated by users

### **3. Saturating Math**

**Concept**: Safe arithmetic that prevents overflow/underflow

```rust
let refund = total_deposited.saturating_sub(vested_amount);
```

**Why important**: Prevents contract crashes from mathematical errors

### **4. State Mutations vs Queries**

**Concept**: Different types of contract interactions

- **Queries**: Read-only, free, instant (`#[ink(message)]`)
- **Mutations**: State-changing, cost gas, async (`#[ink(message)]`)
- **Payable**: Can receive DOT (`#[ink(message, payable)]`)

### **5. Access Control Patterns**

**Concept**: Ensuring only authorized users can perform actions

```rust
// Only creator can add content
let caller = self.env().caller();
if !self.creators.contains(caller) {
    return Err(Error::CreatorNotFound);
}

// Only subscribers can access content
if !self.subscriptions.contains((fan, creator)) {
    return Err(Error::SubscriptionRequired);
}
```

### **6. IPFS Content Storage**

**Concept**: Decentralized file storage for exclusive content

- **On-chain**: Store IPFS hash (small string)
- **Off-chain**: Actual content stored on IPFS network
- **Benefits**: Decentralized, immutable, cost-effective

---

## 🎯 **Success Criteria**

### **Must Have**:

- [ ] **claim_earnings()** working with accurate time calculations
- [ ] **cancel_subscription()** with fair refund logic
- [ ] **Content gating** based on subscription status
- [ ] **All unit tests** passing
- [ ] **Updated documentation** with new concepts

### **Nice to Have**:

- [ ] **Gas optimization** for large creator lists
- [ ] **Event emission** for all new functions
- [ ] **Error handling** for edge cases

---

## 🚨 **Risk Mitigation**

### **High Risk**:

- **Vesting math bugs**: Use simple per-second calculation, extensive testing
- **Overflow errors**: Use saturating arithmetic throughout

### **Medium Risk**:

- **Time calculation accuracy**: Test with various time intervals
- **Access control**: Verify only authorized users can perform actions

### **Low Risk**:

- **IPFS integration**: Just store hashes as strings for MVP

---

## ⏰ **Time Allocation**

| Task                  | Time       | Priority |
| --------------------- | ---------- | -------- |
| claim_earnings()      | 25 min     | Critical |
| cancel_subscription() | 20 min     | Critical |
| Content management    | 25 min     | High     |
| Creator discovery     | 15 min     | Medium   |
| Testing & docs        | 5 min      | High     |
| **Total**             | **90 min** |          |

---

## 🔄 **Integration with Sprint 1**

### **Building On**:

- **Existing subscription logic** from `subscribe()`
- **Creator profiles** from `register_creator()`
- **Event system** for frontend notifications
- **Error handling** patterns established

### **Extending**:

- **Time-based calculations** for vesting
- **Content gating** for exclusive access
- **Complete subscription lifecycle** (create → vest → claim → cancel)

---

## 🎉 **Sprint 2 Deliverables**

1. **Complete subscription lifecycle** working end-to-end
2. **Time-based vesting** with accurate calculations
3. **Content gating** system for exclusive access
4. **Comprehensive unit tests** for all functions
5. **Updated Web3 concepts** documentation
6. **Ready for deployment** once build issues resolved

**Sprint 2 will complete the core Creator Treasury functionality!** 🚀
