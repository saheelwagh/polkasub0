# 🔄 REVISED Sprint Plan: Creator Treasury

## Current State Analysis (Nov 16, 2:30pm)

### ✅ **COMPLETED (4 hours spent)**

- **Landing Page**: Complete with value prop, problem/solution, how it works
- **Creator Discovery**: Mock data, 6 creators, visual design hints, one eligible creator
- **Creator Profile**: Full subscription flow UI, content gating display, mock interactions
- **Navbar**: Real Web3 integration with wallet connection
- **UI Components**: Input, Label, consolidated imports
- **Design System**: Coursera-inspired theme, responsive design

### ❌ **NOT STARTED (Critical Path)**

- **ink! Smart Contract**: No contract exists yet
- **Backend Integration**: No contract calls implemented
- **Creator Dashboard**: Missing page
- **Creator Registration**: Missing page

---

## 🚨 CRITICAL PIVOT NEEDED

**Problem**: We're frontend-heavy but have ZERO backend. This is high risk for demo.

**Solution**: Prioritize contract development immediately, then integrate.

---

## 📋 REVISED 8-Hour Plan

### **IMMEDIATE PRIORITY: Sprint 1-5 (Backend) - 6 hours**

#### **Sprint 1: Contract Foundation (90 min) - START NOW**

**Goal**: Get basic contract working

**Tasks**:

- [ ] `cd contracts/src && cargo contract new creator_treasury`
- [ ] Define basic structs: `CreatorProfile`, `Subscription`
- [ ] Implement `register_creator()` function
- [ ] Implement `get_creator_list()` query
- [ ] Compile and test locally

**Deliverable**: Working contract with creator registration

---

#### **Sprint 2: Subscription Logic (90 min)**

**Goal**: Core subscription functionality

**Tasks**:

- [ ] Implement `subscribe()` payable function
- [ ] Calculate `rate_per_second = monthly_rate / 2_592_000`
- [ ] Store subscription in mapping `(fan, creator) → Subscription`
- [ ] Emit `SubscriptionCreated` event
- [ ] Unit test subscription flow

**Deliverable**: Fans can subscribe with DOT deposits

---

#### **Sprint 3: Vesting & Claiming (90 min)**

**Goal**: Time-based earnings

**Tasks**:

- [ ] Implement `claim_earnings()` with timestamp logic
- [ ] Calculate vested: `(now - last_claim) * rate_per_second`
- [ ] Update balance tracking to prevent over-claiming
- [ ] Unit test time calculations
- [ ] Handle edge case: balance exhausted

**Deliverable**: Creators can claim streaming earnings

---

#### **Sprint 4: Cancel & Refund (90 min)**

**Goal**: Complete subscription lifecycle

**Tasks**:

- [ ] Implement `cancel_subscription()` function
- [ ] Calculate unvested amount: `total_deposited - (elapsed * rate)`
- [ ] Transfer unvested back to fan
- [ ] Add access control (only subscriber can cancel)
- [ ] Deploy to local node for testing

**Deliverable**: Full subscribe → vest → cancel flow

---

#### **Sprint 5: Content Gating (90 min)**

**Goal**: Content access control

**Tasks**:

- [ ] Implement `add_exclusive_content()` (creator only)
- [ ] Implement `get_creator_content()` with subscription check
- [ ] Unit test content gating logic
- [ ] Deploy to Shibuya testnet
- [ ] Test with Polkadot.js Apps

**Deliverable**: Content gating working on testnet

---

### **FRONTEND INTEGRATION: Sprint 6-8 (Frontend) - 2 hours**

#### **Sprint 6: Contract Integration (45 min)**

**Goal**: Connect frontend to real contract

**Tasks**:

- [ ] Update creator discovery to call `get_creator_list()`
- [ ] Update creator profile to call contract functions
- [ ] Replace mock data with real contract queries
- [ ] Add loading states and error handling

**Deliverable**: Frontend connected to real contract

---

#### **Sprint 7: Creator Dashboard (45 min)**

**Goal**: Creator management interface

**Tasks**:

- [ ] Create `/dashboard` page
- [ ] Add "Add Content" form calling `add_exclusive_content()`
- [ ] Add "Claim Earnings" button calling `claim_earnings()`
- [ ] Show earnings balance and subscriber count
- [ ] Add creator registration flow

**Deliverable**: Complete creator tools

---

#### **Sprint 8: Final Integration & Demo (30 min)**

**Goal**: End-to-end testing and demo prep

**Tasks**:

- [ ] Test complete user flows:
  - Creator registers → adds content
  - Fan subscribes → unlocks content
  - Creator claims earnings
  - Fan cancels → gets refund
- [ ] Record 2-3 minute demo video
- [ ] Prepare demo talking points

**Deliverable**: Demo-ready MVP

---

## ⚠️ **RISK MITIGATION**

### **High Risk Items**:

1. **Vesting Math Complexity**: Keep simple per-second calculation
2. **Contract Deployment**: Have local node backup if testnet fails
3. **Frontend Integration Time**: Reuse existing UI, focus on contract calls

### **Fallback Strategy**:

If contract development takes longer:

- **6 hours**: Focus on Sprints 1-4 (core functionality)
- **2 hours**: Basic frontend integration with simplified features
- **Demo**: Show working subscription lifecycle even if content gating is mock

---

## 🎯 **SUCCESS METRICS**

### **Must Have (MVP)**:

- [ ] Creator can register and add content
- [ ] Fan can subscribe with DOT payment
- [ ] Streaming payments vest over time
- [ ] Creator can claim earnings
- [ ] Fan can cancel and get refund
- [ ] Content gating works (subscribe to unlock)

### **Demo Flow**:

1. **Creator Registration**: Show creator registering on-chain
2. **Content Upload**: Creator adds exclusive content
3. **Fan Subscription**: Fan subscribes with 5 DOT/month
4. **Content Unlock**: Fan immediately sees exclusive content
5. **Earnings Stream**: Show creator earnings increasing over time
6. **Claim Earnings**: Creator claims vested DOT
7. **Cancellation**: Fan cancels, gets unvested DOT back

---

## 🚀 **IMMEDIATE ACTION REQUIRED**

**Next Step**: Start Sprint 1 immediately

```bash
cd contracts/src
cargo contract new creator_treasury
```

**Time Remaining**: 8 hours
**Critical Path**: Contract development (6 hours) → Integration (2 hours)
**Success Probability**: 85% if we start backend NOW

The frontend foundation is solid. Now we need to build the smart contract that powers it! 🔥
