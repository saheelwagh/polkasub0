# 🏃 12-Hour Sprint Plan: Decentralized Patreon

## Project Overview

**Name:** Creator Treasury  
**Concept:** Subscription-based content gating with streaming payments via ink! smart contracts  
**Time:** 12 hours (8 x 90-minute sprints)

---

## Sprint Breakdown

### ✅ Sprint 1: Contract Foundation (90 min)

**Goal:** Basic contract structure + storage design

**Tasks:**

- [ ] Create new ink! contract: `cargo contract new creator_treasury`
- [ ] Define `CreatorProfile` and `Subscription` structs
- [ ] Implement `register_creator()` function
- [ ] Implement `get_creator_list()` query
- [ ] Write unit tests for creator registration

**Deliverable:** Compiling contract with creator registration working

---

### ✅ Sprint 2: Subscription Logic (90 min)

**Goal:** Implement subscribe() with payment deposits

**Tasks:**

- [ ] Implement `subscribe()` payable function
- [ ] Calculate `rate_per_second` from monthly rate
- [ ] Store subscription in nested mapping
- [ ] Emit `SubscriptionCreated` event
- [ ] Unit test subscription flow

**Deliverable:** Working subscription with deposit mechanism

---

### ✅ Sprint 3: Vesting & Claiming (90 min)

**Goal:** Time-based vesting math + claim_earnings()

**Tasks:**

- [ ] Implement `claim_earnings()` with timestamp logic
- [ ] Calculate vested amount: `(now - last_claim) * rate_per_second`
- [ ] Update balance tracking
- [ ] Unit test time-based claiming
- [ ] Handle edge case: claim when balance exhausted

**Deliverable:** Working vesting with accurate time calculations

---

### ✅ Sprint 4: Cancel & Refund (90 min)

**Goal:** cancel_subscription() with instant refund

**Tasks:**

- [ ] Implement `cancel_subscription()` function
- [ ] Calculate unvested amount for refund
- [ ] Transfer unvested back to subscriber
- [ ] Add access control (only subscriber can cancel)
- [ ] Deploy to local node for manual testing

**Deliverable:** Full subscription lifecycle working (subscribe → vest → cancel)

---

### ✅ Sprint 5: Content Gating (90 min)

**Goal:** Content upload and access control

**Tasks:**

- [ ] Implement `add_exclusive_content()` (creator only)
- [ ] Implement `get_creator_content()` with subscription check
- [ ] Unit test content gating logic
- [ ] Deploy contract to Shibuya testnet
- [ ] Verify deployment and test with Polkadot.js

**Deliverable:** Content gating working on testnet

---

### ✅ Sprint 6: Frontend - Creator Discovery (90 min)

**Goal:** Display all creators, navigate to profiles

**Tasks:**

- [ ] Remove old curation platform code
- [ ] Create `/creators` page
- [ ] Fetch and display `get_creator_list()`
- [ ] Add creator cards with "View Profile" buttons
- [ ] Route to `/creator/[address]`

**Deliverable:** Creator discovery page working

---

### ✅ Sprint 7: Frontend - Subscribe & Content (90 min)

**Goal:** Fan can subscribe and unlock content

**Tasks:**

- [ ] Create `/creator/[address]` dynamic page
- [ ] Add subscription UI (monthly rate input + Subscribe button)
- [ ] Implement content gating display logic
- [ ] Add "Cancel Subscription" button
- [ ] Test full fan flow end-to-end

**Deliverable:** Complete subscriber experience

---

### ✅ Sprint 8: Creator Dashboard & Polish (90 min)

**Goal:** Creator tools + final testing

**Tasks:**

- [ ] Create `/dashboard` page for creators
- [ ] Add "Add Content" form (IPFS hash input)
- [ ] Add "Claim Earnings" button with balance display
- [ ] Test complete happy path:
  - Creator registers → adds content
  - Fan subscribes → unlocks content
  - Creator claims earnings after time passes
- [ ] Record 2-3 minute demo video

**Deliverable:** Complete MVP ready to present

---

## Risk Mitigation

**High Risk:**

- Vesting math bugs → Keep rate calculation simple (per-second), add extensive tests
- Storage complexity → Use simple mappings, avoid nested tuple keys if possible

**Medium Risk:**

- Frontend integration time → Reuse existing inkathon components
- Testnet deployment issues → Have local node backup

**Low Risk:**

- IPFS integration → Just store hashes as strings, no actual upload needed for MVP

---

## Success Criteria

**Must Have (MVP):**

- ✅ Creator registration
- ✅ Subscription with deposits
- ✅ Time-based vesting claims
- ✅ Cancel with refunds
- ✅ Content gating by subscription
- ✅ Working frontend for all flows

**Nice to Have (if time):**

- [ ] Multiple content pieces per creator
- [ ] Subscription history/analytics
- [ ] Creator earnings dashboard chart
- [ ] Email notifications (off-chain)

**Demo Goals:**

- Show creator registering and adding content
- Show fan subscribing and unlocking content
- Show time passing and creator claiming earnings
- Show fan canceling and getting refund

---

## Polkadot-Specific Highlights for Demo

1. **ink! Smart Contracts** - Showcase Polkadot-native contract language
2. **Vesting Logic** - Time-based on-chain calculations (Polkadot strength)
3. **Low Fees** - Emphasize micropayment viability vs. Ethereum
4. **Future: XCM** - Mention cross-chain subscriptions (pay from any parachain)

---

## Time Tracking

| Sprint | Start | End | Status         | Actual Progress            |
| ------ | ----- | --- | -------------- | -------------------------- |
| 1      | -     | -   | ❌ NOT STARTED | Contract foundation needed |
| 2      | -     | -   | ❌ NOT STARTED | Subscription logic needed  |
| 3      | -     | -   | ❌ NOT STARTED | Vesting & claiming needed  |
| 4      | -     | -   | ❌ NOT STARTED | Cancel & refund needed     |
| 5      | -     | -   | ❌ NOT STARTED | Content gating needed      |
| 6      | -     | -   | ✅ COMPLETED   | Frontend pages built       |
| 7      | -     | -   | ✅ COMPLETED   | Creator profile built      |
| 8      | -     | -   | ⚠️ PARTIAL     | Dashboard page missing     |

**Current Status:** Frontend-heavy progress, backend not started
**Time Spent:** ~4 hours on frontend (ahead of schedule)
**Remaining:** 8 hours for backend + integration
