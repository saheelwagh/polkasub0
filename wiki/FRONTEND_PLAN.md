# 🎨 Frontend Plan: Creator Treasury

## App Flow Overview

**Creator Treasury** = Decentralized Patreon where creators get streaming payments for exclusive content

**User Journey:**

1. **Landing** → Learn what Creator Treasury is
2. **Browse Creators** → Discover creators to support
3. **Creator Profile** → Subscribe & unlock content
4. **Creator Dashboard** → Manage content & claim earnings

---

## 📄 Pages to Build

### 1. **Landing Page** (`/`)

**Purpose:** Explain Creator Treasury concept & drive signups

**Content:**

- **Hero:** "Support creators with streaming crypto payments"
- **Problem:** "Creators lose money to platform fees & delayed payments"
- **Solution:** "Direct subscriptions with instant, streaming payments on Polkadot"
- **How it works:** 3-step process (Subscribe → Stream → Unlock)
- **CTA:** "Browse Creators" + "Become a Creator"

**Components:**

- Hero section with animated payment stream visualization
- Problem/solution cards
- "How it works" timeline
- Creator testimonial cards (mock data)
- Footer with links

**Route:** `/`  
**File:** `frontend/src/app/page.tsx`

---

### 2. **Creator Discovery** (`/creators`)

**Purpose:** Browse all registered creators

**Content:**

- **Header:** "Discover Creators"
- **Creator Grid:** Cards showing:
  - Creator name
  - Profile image (placeholder)
  - Content preview ("Exclusive Web3 tutorials")
  - Subscription price (e.g., "5 DOT/month")
  - Subscriber count
  - "View Profile" button

**Features:**

- Search by creator name
- Filter by price range
- Sort by popularity/newest

**Route:** `/creators`  
**File:** `frontend/src/app/creators/page.tsx`

---

### 3. **Creator Profile** (`/creator/[address]`)

**Purpose:** Subscribe to creator & access content

**Content:**

- **Creator Info:**
  - Name, bio, social links
  - Total subscribers, earnings
  - Subscription price
- **Subscription Section:**
  - "Subscribe for X DOT/month" button
  - Current subscription status
  - "Cancel Subscription" (if subscribed)
- **Content Section:**
  - If not subscribed: "🔒 Subscribe to unlock exclusive content"
  - If subscribed: List of IPFS links/content
- **Earnings Stream:**
  - Real-time counter showing creator earnings from your subscription

**States:**

- Not connected → "Connect wallet to subscribe"
- Connected, not subscribed → Show subscribe button
- Connected, subscribed → Show content + cancel option

**Route:** `/creator/[address]`  
**File:** `frontend/src/app/creator/[address]/page.tsx`

---

### 4. **Creator Dashboard** (`/dashboard`)

**Purpose:** Creator tools to manage content & earnings

**Access Control:** Only for registered creators

**Content:**

- **Earnings Overview:**
  - Total earned (all time)
  - Pending earnings (unvested)
  - "Claim Earnings" button
  - Earnings chart (if time permits)
- **Content Management:**
  - "Add New Content" form (IPFS hash + description)
  - List of existing content with edit/delete
- **Subscriber Analytics:**
  - Current subscriber count
  - Recent subscriptions/cancellations
  - Revenue per month

**Route:** `/dashboard`  
**File:** `frontend/src/app/dashboard/page.tsx`

---

### 5. **Creator Registration** (`/register`)

**Purpose:** Onboard new creators

**Content:**

- **Registration Form:**
  - Creator name
  - Bio/description
  - Social media links (optional)
  - Subscription price (DOT/month)
- **Terms & Conditions**
- **"Register as Creator" button**

**Flow:**

1. Fill form
2. Connect wallet
3. Call `register_creator()` contract function
4. Redirect to `/dashboard`

**Route:** `/register`  
**File:** `frontend/src/app/register/page.tsx`

---

### 6. **My Subscriptions** (`/subscriptions`)

**Purpose:** Manage active subscriptions

**Content:**

- **Active Subscriptions:**
  - Creator cards with:
    - Name, subscription price
    - Amount paid so far
    - Time remaining (based on deposit)
    - "View Content" + "Cancel" buttons
- **Subscription History:**
  - Past subscriptions with total paid

**Route:** `/subscriptions`  
**File:** `frontend/src/app/subscriptions/page.tsx`

---

## 🧩 Shared Components

### Navigation (`/components/layout/navbar.tsx`)

**Links:**

- Logo → `/`
- "Creators" → `/creators`
- "My Subscriptions" → `/subscriptions` (if connected)
- "Dashboard" → `/dashboard` (if creator)
- Wallet connect button

### Creator Card (`/components/creator-card.tsx`)

**Reusable card component for:**

- Creator discovery grid
- Subscription management
- Search results

**Props:** `creator`, `showSubscribeButton`, `showManageButton`

### Subscription Status (`/components/subscription-status.tsx`)

**Shows current subscription state:**

- Not subscribed
- Active (with time remaining)
- Expired
- Cancelled

---

## 🎨 Design System

**Theme:** Keep existing Coursera-inspired light blue theme

**Key Colors:**

- Primary: `#0056d2` (subscription buttons, CTAs)
- Success: `#22c55e` (active subscriptions, earnings)
- Warning: `#f59e0b` (expiring subscriptions)
- Muted: `#6b7280` (secondary text)

**Typography:**

- Headings: Bold, tracking-tight
- Body: Regular, good line-height for readability
- Monospace: For addresses, earnings amounts

**Components:**

- Cards: Rounded corners, subtle shadows
- Buttons: Primary (blue), Secondary (outline), Ghost
- Forms: Clean inputs with focus states
- Loading: Skeleton components for contract calls

---

## 🔄 User Flow Examples

### **New Fan Journey:**

1. `/` → Learn about Creator Treasury
2. `/creators` → Browse creators
3. `/creator/0x123` → View creator profile
4. Connect wallet → Subscribe for 5 DOT/month
5. Unlock content → View IPFS links
6. `/subscriptions` → Manage subscription

### **New Creator Journey:**

1. `/` → "Become a Creator" CTA
2. `/register` → Fill registration form
3. Connect wallet → Call `register_creator()`
4. `/dashboard` → Add first content piece
5. Share profile link → Get subscribers
6. `/dashboard` → Claim earnings

### **Returning User:**

1. `/` → Auto-redirect based on role:
   - Has subscriptions → `/subscriptions`
   - Is creator → `/dashboard`
   - Neither → `/creators`

---

## 📱 Responsive Design

**Breakpoints:**

- Mobile: `< 768px` - Stack cards, full-width forms
- Tablet: `768px - 1024px` - 2-column grids
- Desktop: `> 1024px` - 3-column grids, sidebar layouts

**Mobile-First Features:**

- Touch-friendly buttons (min 44px)
- Swipeable creator cards
- Collapsible navigation
- Bottom sheet for wallet connection

---

## 🚀 Implementation Order

### Phase 1: Core Pages (3 hours)

1. **Landing page** (`/`) - Explain the concept
2. **Creator discovery** (`/creators`) - Browse creators
3. **Creator profile** (`/creator/[address]`) - Subscribe & view content

### Phase 2: Creator Tools (2 hours)

4. **Creator registration** (`/register`) - Onboard creators
5. **Creator dashboard** (`/dashboard`) - Manage content & earnings

### Phase 3: User Management (1 hour)

6. **My subscriptions** (`/subscriptions`) - Manage active subscriptions

---

## 🎯 Success Metrics

**Must Have:**

- [ ] Clear value proposition on landing page
- [ ] Easy creator discovery and subscription flow
- [ ] Working content gating (subscribe → unlock)
- [ ] Creator can add content and claim earnings

**Nice to Have:**

- [ ] Real-time earnings counter
- [ ] Subscription analytics
- [ ] Search and filtering
- [ ] Mobile-responsive design

---

## 🔧 Technical Notes

**State Management:**

- Use React hooks for component state
- Contract calls via Polkadot.js + inkathon
- No global state manager needed (keep it simple)

**Data Fetching:**

- Contract queries on page load
- Optimistic updates for better UX
- Loading skeletons during contract calls

**Error Handling:**

- Toast notifications for contract errors
- Fallback UI for failed queries
- Clear error messages for users

**Performance:**

- Lazy load creator images
- Paginate creator list if > 50 creators
- Cache contract query results

---

Ready to start building the landing page? 🎨
