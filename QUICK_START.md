# Quick Start Guide - Crowdfunding DAPP

Get your crowdfunding system up and running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- MetaMask wallet extension

## Step-by-Step Setup

### 1. Install Dependencies (2 minutes)

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install --cache /tmp/npm-cache
cd ..
```

### 2. Start Hardhat Node (Terminal 1)

```bash
npx hardhat node
```

Keep this terminal running. You'll see test accounts with ETH balances.

### 3. Deploy Contracts (Terminal 2)

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

**Copy the contract addresses from the output!** You'll need them for the frontend.

Example output:
```
============================================================
DEPLOYMENT SUMMARY
============================================================
FundingToken:         0x5FbDB2315678afecb367f032d93F642f64180aa3
CrowdFunding:         0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
SponsorFunding:       0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
DistributeFunding:    0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
============================================================
```

### 4. Configure Frontend

Edit `frontend/src/contracts/addresses.ts`:

```typescript
export const CONTRACTS = {
  FUNDING_TOKEN: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as `0x${string}`,
  CROWD_FUNDING: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as `0x${string}`,
  SPONSOR_FUNDING: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as `0x${string}`,
  DISTRIBUTE_FUNDING: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9' as `0x${string}`,
};
```

Replace with YOUR deployed addresses!

### 5. Setup MetaMask

1. Open MetaMask
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Enter:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
4. Click "Save"

5. Import a test account:
   - In MetaMask: Click profile → "Import Account"
   - Copy a private key from Hardhat terminal output
   - Paste and import

### 6. Start Frontend (Terminal 3)

```bash
cd frontend
npm run dev
```

Visit: **http://localhost:3000**

### 7. Connect Wallet

1. Click "Connect Wallet" button in top right
2. Select MetaMask
3. Approve connection

## Usage Flow

### First Time Setup

1. **Buy Tokens** (as any user)
   - Go to "Tokens" page
   - Enter 1 ETH
   - Click "Buy Tokens"
   - Approve transaction

2. **Add Campaign** (as owner or user)
   - Go to "Campaigns" page
   - Paste the CrowdFunding address from deployment
   - Click "Add"

3. **Contribute**
   - Click on the campaign card
   - Enter token amount (e.g., 5000)
   - Click "Approve" → confirm
   - Click "Deposit" → confirm

4. **Reach Goal & Sponsor**
   - Keep contributing until goal is reached (10,000 tokens)
   - As owner, click "Request Sponsorship"
   - Sponsorship is added automatically

5. **Distribute Funds**
   - As owner, click "Transfer to Distribution"
   - Shareholders can now withdraw their shares

## Testing Different Roles

### As Campaign Owner:
- Account #0 from Hardhat (the deployer)
- Can create campaigns, request sponsorship, transfer funds

### As Contributor:
- Import Account #1 or #2 from Hardhat
- Buy tokens, contribute to campaigns

### As Shareholder:
- Accounts #1, #2, #3 are pre-configured as shareholders
- Can withdraw shares after distribution

## Troubleshooting

### "Contract not configured"
→ Make sure you updated `frontend/src/contracts/addresses.ts` with deployed addresses

### "Insufficient funds"
→ Make sure you bought tokens first on the "Tokens" page

### "Wrong network"
→ Switch MetaMask to "Hardhat Local" network

### "Transaction failed"
→ Check Hardhat terminal for error messages

### "Cannot connect wallet"
→ Refresh page and try again

## Quick Demo Flow (3 minutes)

1. Connect wallet ✓
2. Go to Tokens → Buy 10 tokens (10 ETH) ✓
3. Go to Campaigns → Add the CrowdFunding address ✓
4. Click campaign → Deposit 10,000 tokens ✓
5. Click "Request Sponsorship" (owner only) ✓
6. Campaign is now fully funded! ✓

## Next Steps

- Explore the Admin Panel
- Try creating a new campaign (owner only)
- Test withdrawals before goal
- Check the activity feed
- Try on mobile device

## Development Commands

```bash
# Backend
npx hardhat compile     # Compile contracts
npx hardhat test        # Run tests
npx hardhat node        # Start local node
npx hardhat clean       # Clean artifacts

# Frontend
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
```

## Support

- Backend issues: Check `README.md`
- Frontend issues: Check `frontend/README.md`
- Full documentation: See `IMPLEMENTATION_SUMMARY.md`

---

## 🎉 You're Ready!

Your crowdfunding DAPP is now live at http://localhost:3000

Happy crowdfunding! 🚀

