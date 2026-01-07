# 🗺️ Quick Navigation Guide

A visual map of the crowdfunding DAPP and how pages connect.

---

## Page Map

```
┌─────────────────────────────────────────────────────┐
│                    HEADER (Always Visible)           │
│  [Logo] Home | Tokens | Campaigns | Admin [Wallet]  │
└─────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    
┌──────────┐      ┌──────────────┐      ┌──────────┐
│   HOME   │      │  TOKEN HUB   │      │CAMPAIGNS │
│  Page    │      │              │      │   List   │
└──────────┘      └──────────────┘      └──────────┘
     │                    │                    │
     │            Buy Tokens Here              │
     │            See Balance                  │
     │                    │                    │
     └────────────┬───────┴────────┬──────────┘
                  │                │
                  ▼                ▼
         ┌─────────────────────────────┐
         │   CAMPAIGN DETAIL PAGE      │
         │                             │
         │  • View Progress            │
         │  • Contribute Tokens        │
         │  • Withdraw (if early)      │
         │  • Request Sponsorship      │
         │  • Transfer to Distribution │
         │  • Withdraw Share           │
         └─────────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
┌──────────────┐   ┌─────────────┐
│CREATE        │   │ADMIN        │
│CAMPAIGN      │   │PANEL        │
│(Owner Only)  │   │(Owner Only) │
└──────────────┘   └─────────────┘
```

---

## Navigation Paths

### Path 1: New User Journey
```
HOME → TOKENS → Buy Tokens → CAMPAIGNS → Add Campaign → 
CAMPAIGN DETAIL → Contribute
```
⏱️ Time: 5 minutes

### Path 2: Campaign Owner Journey
```
HOME → ADMIN → Create Campaign → CAMPAIGNS → 
CAMPAIGN DETAIL → Monitor → Request Sponsorship → 
Transfer to Distribution
```
⏱️ Time: 10 minutes

### Path 3: Shareholder Journey
```
HOME → CAMPAIGNS → CAMPAIGN DETAIL → 
Wait for Funded State → Withdraw Share
```
⏱️ Time: 2 minutes

---

## Page-by-Page Navigation

### 🏠 HOME PAGE

**Where it leads:**
- "Get Tokens" button → **TOKEN HUB**
- "View Campaigns" button → **CAMPAIGNS LIST**
- Top nav "Home" → Stays here
- Top nav "Tokens" → **TOKEN HUB**
- Top nav "Campaigns" → **CAMPAIGNS LIST**
- Top nav "Admin" → **ADMIN PANEL** (owner only)

**Best for:**
- First-time visitors
- Understanding the platform
- Quick navigation start

---

### 💰 TOKEN HUB

**URL:** `/tokens`

**Where it leads:**
- Back to **HOME** (top nav)
- To **CAMPAIGNS** (top nav)
- To **ADMIN** (top nav, if owner)

**Actions available:**
- Buy tokens with ETH
- View your balance
- Check token price
- See total supply

**Best for:**
- Buying tokens before contributing
- Checking your balance
- Understanding token economics

---

### 📋 CAMPAIGNS LIST

**URL:** `/campaigns`

**Where it leads:**
- Click campaign card → **CAMPAIGN DETAIL**
- "Create Campaign" button → **CREATE CAMPAIGN** (owner only)
- Back to **HOME** (top nav)

**Actions available:**
- Add campaign by address
- Filter campaigns by state
- View campaign cards
- Click to see details

**Best for:**
- Discovering campaigns
- Tracking multiple projects
- Quick overview of all campaigns

---

### 🎯 CAMPAIGN DETAIL

**URL:** `/campaign/0x...`

**Where it leads:**
- "Back to Campaigns" button → **CAMPAIGNS LIST**
- Top nav still available

**Actions available:**
Based on state and role:

**State: UNFUNDED (Yellow)**
- ✅ Approve tokens
- ✅ Deposit tokens
- ✅ Withdraw tokens
- ✅ View activity feed

**State: PRE-FUNDED (Blue)**
- ✅ Request Sponsorship (owner only)
- ✅ View progress
- ✅ View activity feed

**State: FUNDED (Green)**
- ✅ Transfer to Distribution (owner only)
- ✅ Withdraw Share (shareholders)
- ✅ View activity feed

**Best for:**
- Contributing to campaigns
- Monitoring progress
- Owner management
- Shareholder withdrawals

---

### ➕ CREATE CAMPAIGN

**URL:** `/create-campaign`

**Where it leads:**
- Success modal → **CAMPAIGNS LIST**
- "Back" buttons → Previous wizard step
- Top nav available

**Actions available:**
- Step 1: Set funding goal
- Step 2: Configure sponsorship
- Step 3: Add shareholders
- Step 4: Review and deploy

**Who can access:** Owner only

**Best for:**
- Creating new campaigns
- Setting up fundraising
- Defining distribution

---

### ⚙️ ADMIN PANEL

**URL:** `/admin`

**Where it leads:**
- "Create Campaign" → **CREATE CAMPAIGN**
- "Buy Tokens" → **TOKEN HUB**
- "Manage Campaigns" → **CAMPAIGNS LIST**
- "View All Campaigns" → **CAMPAIGNS LIST**

**Actions available:**
- View system stats
- Manage token contract
- Monitor sponsor balance
- Quick campaign access
- Buy tokens for sponsorship

**Who can access:** Owner only

**Best for:**
- System overview
- Contract management
- Quick navigation hub
- Monitoring all campaigns

---

## Quick Action Map

### "I want to buy tokens"
```
Any Page → Top Nav "Tokens" → TOKEN HUB → Buy
```

### "I want to contribute"
```
Any Page → Top Nav "Campaigns" → CAMPAIGNS LIST → 
Click Campaign → Approve + Deposit
```

### "I want to create a campaign"
```
Any Page → Top Nav "Admin" → Click "Create Campaign" → 
Follow Wizard
```

### "I want to withdraw my share"
```
Any Page → Top Nav "Campaigns" → Click Campaign → 
Scroll to "Your Share" → Withdraw
```

### "I want to see all contracts"
```
Any Page → Top Nav "Admin" → ADMIN PANEL → 
View Management Cards
```

---

## State-Based Navigation

### Campaign States & Available Actions

**UNFUNDED (Yellow Badge)**
```
Campaign Detail Page Shows:
├── Contribution Form
│   ├── Approve Button
│   └── Deposit Button
├── Your Contribution Display
│   └── Withdraw Button
└── Activity Feed
```

**PRE-FUNDED (Blue Badge)**
```
Campaign Detail Page Shows:
├── Request Sponsorship Button (Owner)
├── Progress Display
└── Activity Feed
```

**FUNDED (Green Badge)**
```
Campaign Detail Page Shows:
├── Transfer to Distribution Button (Owner)
├── Your Share Card (Shareholders)
│   └── Withdraw Share Button
└── Activity Feed
```

---

## Breadcrumb Navigation

### Understanding Where You Are

**URL Structure:**
- `/` → Home
- `/tokens` → Token Hub
- `/campaigns` → Campaign List
- `/campaign/0x...` → Campaign Detail
- `/create-campaign` → Creation Wizard
- `/admin` → Admin Panel

**Visual Indicators:**
- **Active page** in nav is highlighted
- **Page title** at top shows current location
- **Back buttons** show where you can return
- **Breadcrumbs** (coming from links) show path

---

## Mobile Navigation

### Hamburger Menu (☰)

**On mobile/tablet, top-right button opens:**
```
☰ Menu
├── Home
├── Tokens
├── Campaigns
├── Admin (if owner)
└── [Connect Wallet]
```

**To close:**
- Click ☰ again
- Click outside menu
- Select a menu item

---

## Keyboard Navigation

### Quick Keys

| Key | Action |
|-----|--------|
| **Tab** | Move between interactive elements |
| **Enter** | Click focused button/link |
| **Escape** | Close modals/dropdowns |
| **Arrow Keys** | Navigate lists |
| **Space** | Scroll page |

---

## Emergency Navigation

### If You Get Lost

**Method 1: Logo**
- Click "CrowdFund" logo (top-left)
- Always returns to HOME

**Method 2: Browser Back**
- Use browser back button
- Returns to previous page

**Method 3: URL**
- Type URL directly:
  - `localhost:3000/` → Home
  - `localhost:3000/tokens` → Tokens
  - `localhost:3000/campaigns` → Campaigns
  - `localhost:3000/admin` → Admin

**Method 4: Refresh**
- Reload page (F5 or Ctrl+R)
- Stays on current page
- Useful if stuck

---

## Navigation Tips

### Best Practices

1. **Use Top Nav** - Always visible, quick access
2. **Follow Flow** - Home → Tokens → Campaigns → Detail
3. **Bookmark** - Save campaign URLs you visit often
4. **Back Buttons** - Use in-app back buttons (better UX)
5. **Multiple Tabs** - Open different pages in tabs

### Common Mistakes

❌ Using browser back during transactions
✅ Wait for transaction to complete

❌ Opening campaign detail without campaign address
✅ Add campaign to list first

❌ Trying to contribute without tokens
✅ Buy tokens first at Token Hub

❌ Looking for owner features as regular user
✅ Check if you're using owner account

---

## Navigation FAQ

**Q: How do I get back to the campaign list?**
A: Click "Back to Campaigns" link or use top nav "Campaigns"

**Q: Where do I check my balance?**
A: Top nav "Tokens" → Token Hub page

**Q: Can't find Admin Panel?**
A: Only visible if you're the contract owner (Account #0)

**Q: How to switch between campaigns?**
A: Go to Campaigns list, click different campaign card

**Q: Lost on a page?**
A: Click logo to go home, or use top nav menu

---

## Visual Flow Diagram

### Complete User Journey

```
START
  │
  ▼
┌─────────────┐
│  HOME PAGE  │ ◄─── Always accessible via logo
└──────┬──────┘
       │
       ├─── "Get Tokens" ────┐
       │                     │
       └─── "View Campaigns" │
                ┌────────────┘
                │
                ▼
        ┌───────────────┐
        │  TOKEN HUB    │
        │  Buy Tokens   │
        └───────┬───────┘
                │
                │ Check balance
                │
                ▼
        ┌───────────────┐
        │  CAMPAIGNS    │
        │  Add/Browse   │
        └───────┬───────┘
                │
                │ Click campaign
                │
                ▼
        ┌───────────────┐
        │  CAMPAIGN     │
        │  DETAIL       │
        └───────┬───────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
Contribute  Owner Only  Shareholder
  Flow         Flow        Flow
    │           │           │
    ▼           ▼           ▼
Approve →   Sponsor →  Withdraw
Deposit     Transfer    Share
    │           │           │
    └───────────┴───────────┘
                │
                ▼
              DONE
```

---

## Pro Navigation Tips

### Speed Navigation

**Fastest Routes:**

1. **Buy & Contribute (30 seconds):**
   ```
   Tokens → Enter "1" → Buy → Campaigns → 
   Click → Enter "500" → Approve → Deposit
   ```

2. **Check Balance (5 seconds):**
   ```
   Top Nav "Tokens" → Read balance
   ```

3. **View Campaign (10 seconds):**
   ```
   Campaigns → Click card → View details
   ```

### Power User Tricks

1. **Multiple Tabs:**
   - Tab 1: Token Hub (monitor balance)
   - Tab 2: Campaign Detail (contribute)
   - Tab 3: Admin (if owner)

2. **Keyboard Only:**
   - Tab through fields
   - Enter to submit
   - Escape to cancel

3. **Bookmark Campaigns:**
   - Copy campaign detail URL
   - Bookmark in browser
   - Direct access later

---

## Summary

**Remember:**
- 🏠 **Home** = Starting point
- 💰 **Tokens** = Buy tokens
- 📋 **Campaigns** = Find projects
- 🎯 **Detail** = Interact with campaign
- ➕ **Create** = New campaign (owner)
- ⚙️ **Admin** = Manage system (owner)

**Navigation Golden Rule:**
*When in doubt, click the logo to go home!*

---

*Navigation Guide v1.0*

