# Polkadot Hackathon Ideas (12-15 hours, 3 days)

## 🎯 1. Cross-Chain Reputation Oracle

**Build Time:** 12-15 hours  
**Concept:** A reputation aggregator that pulls activity from multiple parachains (Astar, Moonbeam, etc.) and creates a unified reputation score stored on-chain.

**Why Polkadot:**

- Showcases XCMP messaging between chains
- Uses Substrate pallets for reputation storage
- Demonstrates cross-chain data aggregation (Polkadot's killer feature)

**Scope:**

- Smart contract on ink! to store reputation scores
- Oracle service that listens to 2-3 parachains
- Simple frontend to display cross-chain reputation
- Basic scoring algorithm (transaction count, contract interactions, etc.)

**Tech Stack:** ink! smart contracts, Polkadot.js, React frontend

---

## 🔗 2. XCM Message Tracker & Visualizer

**Build Time:** 10-12 hours  
**Concept:** A real-time dashboard that tracks and visualizes XCM (Cross-Consensus Messaging) flows between parachains with analytics.

**Why Polkadot:**

- Directly showcases Polkadot's unique XCM architecture
- Educational tool for the ecosystem
- Helps developers debug cross-chain messages

**Scope:**

- Listen to XCM events on relay chain + 2-3 parachains
- Store message metadata (origin, destination, status)
- Interactive visualization (network graph or timeline)
- Filter by parachain, message type, or timeframe

**Tech Stack:** Polkadot.js, Substrate API, D3.js/Chart.js, Next.js

---

## 🏛️ 3. On-Chain Governance Participation Tracker

**Build Time:** 12-14 hours  
**Concept:** Track and gamify governance participation across multiple parachains. Users earn badges for voting, proposing, or delegating.

**Why Polkadot:**

- Governance is core to Polkadot/Substrate chains
- Cross-chain governance tracking shows XCMP potential
- Addresses low governance participation problem

**Scope:**

- Track governance events (votes, proposals, delegations)
- Award NFT badges for participation milestones
- Leaderboard of active governance participants
- Simple delegation recommendation system

**Tech Stack:** ink! NFT contract, Polkadot.js, React + Tailwind

---

## 📦 4. Parachain Resource Marketplace

**Build Time:** 14-15 hours  
**Concept:** A marketplace where parachains can offer/request computational resources, storage, or oracle services from each other via XCM.

**Why Polkadot:**

- Leverages cross-chain messaging for service discovery
- Creates economic layer between parachains
- Practical use case for XCMP

**Scope:**

- Smart contract for service listings (resource type, price, provider)
- XCM-based service request/fulfillment flow
- Simple UI to browse and request services
- Mock 2-3 service types (storage, compute, oracle)

**Tech Stack:** ink! contracts, XCM, Polkadot.js, React

---

## 🎓 5. Proof-of-Learning Micro-Credentials

**Build Time:** 10-12 hours  
**Concept:** Lightweight on-chain skill badges earned by completing quick challenges/quizzes. Focus on Polkadot/Substrate skills specifically.

**Why Polkadot:**

- Onboards developers to Polkadot ecosystem
- Uses ink! NFTs for credentials
- Can expand cross-chain (badges recognized on other parachains)

**Scope:**

- 5-10 quick challenges (write ink! function, explain XCM, etc.)
- Automated verification (tests/quizzes)
- Mint NFT badge on completion
- Public profile showing earned badges

### How it reinforces the decentralized course hub vision
1. **Creator plug-ins:** Each lesson or assessment can be published as a quest that auto-mints a badge, keeping the original "add course → add tests" workflow intact while producing an on-chain proof.
2. **Unified learner score:** Badges write directly into the planned credential ledger, immediately boosting the on-chain reputation score that unlocks scholarships or deals.
3. **Demand signal for new courses:** Aggregated badge attempts highlight which skills learners request most, feeding into the "request for course" backlog so creators know what to build next.
4. **Scholarship gating:** Sponsors can require specific badge bundles (e.g., "Substrate Basics" + "XCM Ops") before releasing perks, fulfilling the original "unlock deals via learning progress" promise.
5. **Incremental rollout:** Ship the micro-credential MVP in a weekend, then layer the heavier Udemy/Gumroad-style catalog later, proving traction without building the full marketplace upfront.

**Tech Stack:** ink! NFT contract, automated test runner, Next.js frontend

---

## ⭐ Recommendation

For 12-15 hours: **#2 (XCM Message Tracker)** or **#3 (Governance Tracker)**

- Most achievable in timeframe
- Strong Polkadot differentiation
- Clear demo value
- Useful for ecosystem
