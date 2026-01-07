# Crowdfunding DAPP Frontend

A modern, feature-rich React frontend for the ERC-20 Crowdfunding System built with Vite, TypeScript, Tailwind CSS, and RainbowKit.

## Features

✅ **Multi-Campaign Support** - View and manage multiple crowdfunding campaigns simultaneously  
✅ **Token Acquisition Hub** - Dedicated page for buying tokens and checking balances  
✅ **Complete Functionality Coverage** - All contract functions accessible via intuitive UI  
✅ **Role-Based Access Control** - Owner-only features properly restricted  
✅ **Real-Time Updates** - Live event listening and UI updates  
✅ **Modern Design** - Beautiful, responsive interface with smooth animations  
✅ **Wallet Integration** - Seamless wallet connection with RainbowKit  

## Tech Stack

- **React 18** + **Vite** - Fast development and building
- **TypeScript** - Type safety
- **Tailwind CSS** - Modern, utility-first styling
- **RainbowKit** + **Wagmi** - Wallet connection and blockchain interaction
- **Ethers.js v6** - Contract interactions
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Lucide React** - Modern icon library

## Prerequisites

- Node.js 18+ and npm
- MetaMask or another Web3 wallet
- Running Hardhat local node with deployed contracts

## Installation

```bash
cd frontend
npm install
```

## Configuration

### 1. Update Contract Addresses

After deploying your smart contracts, update the addresses in `src/contracts/addresses.ts`:

```typescript
export const CONTRACTS = {
  FUNDING_TOKEN: '0x...', // Your deployed FundingToken address
  CROWD_FUNDING: '0x...', // Your deployed CrowdFunding address  
  SPONSOR_FUNDING: '0x...', // Your deployed SponsorFunding address
  DISTRIBUTE_FUNDING: '0x...', // Your deployed DistributeFunding address
};
```

### 2. Environment Variables (Optional)

Create a `.env.local` file for environment-specific configuration:

```env
VITE_FUNDING_TOKEN_ADDRESS=0x...
VITE_CROWD_FUNDING_ADDRESS=0x...
VITE_SPONSOR_FUNDING_ADDRESS=0x...
VITE_DISTRIBUTE_FUNDING_ADDRESS=0x...

VITE_ENABLE_TESTNETS=true
VITE_HARDHAT_RPC_URL=http://127.0.0.1:8545
VITE_CHAIN_ID=1337
```

### 3. WalletConnect Project ID (Optional)

For production deployment with WalletConnect support, get a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/) and update `src/wagmi.config.ts`:

```typescript
projectId: 'YOUR_PROJECT_ID_HERE',
```

## Development

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Connect to Local Hardhat Network

1. Start your Hardhat node:
   ```bash
   cd ..
   npx hardhat node
   ```

2. In MetaMask, add the Hardhat network:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337 (or 31337)
   - Currency Symbol: ETH

3. Import a test account from Hardhat's output into MetaMask

4. Connect your wallet to the DAPP

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` folder, ready for deployment.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout/          # Header, Footer, Navigation
│   │   ├── Campaign/        # Campaign-specific components
│   │   ├── Token/           # Token-related components
│   │   ├── Distribution/    # Distribution components
│   │   └── Common/          # Generic components (Button, Card, etc.)
│   ├── pages/               # Page components
│   │   ├── Home.tsx         # Landing page
│   │   ├── TokenHub.tsx     # Token purchase page
│   │   ├── CampaignList.tsx # Campaign listing
│   │   ├── CampaignDetail.tsx # Individual campaign page
│   │   ├── CreateCampaign.tsx # Campaign creation wizard
│   │   └── AdminPanel.tsx   # Admin dashboard
│   ├── hooks/               # Custom React hooks
│   │   ├── useTokenBalance.ts
│   │   ├── useCampaigns.ts
│   │   ├── useCampaignDetails.ts
│   │   ├── useContractEvents.ts
│   │   └── ...
│   ├── contracts/           # Contract ABIs and addresses
│   │   ├── abis.ts
│   │   ├── addresses.ts
│   │   └── types.ts
│   ├── utils/               # Utility functions
│   │   ├── format.ts        # Formatting helpers
│   │   ├── constants.ts     # App constants
│   │   └── transactions.ts  # Transaction helpers
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

## Usage Guide

### For Contributors

1. **Buy Tokens**
   - Navigate to "Tokens" page
   - Enter ETH amount
   - Click "Buy Tokens"
   - Confirm transaction in wallet

2. **Contribute to Campaign**
   - Go to "Campaigns" page
   - Click on a campaign or add by address
   - Enter token amount
   - Click "Approve" then "Deposit"
   - Confirm transactions

3. **Withdraw Contribution**
   - On campaign detail page (only in NEFINANTAT state)
   - Enter amount to withdraw
   - Click "Withdraw"

4. **Withdraw as Shareholder**
   - If you're a shareholder, go to campaign detail page
   - Once funds are distributed, click "Withdraw Share"

### For Campaign Owners

1. **Create Campaign**
   - Click "Create Campaign" (owner only)
   - Follow the 4-step wizard:
     - Set funding goal
     - Configure sponsorship percentage
     - Add shareholders and percentages
     - Review and deploy

2. **Request Sponsorship**
   - On campaign detail page (PREFINANTAT state)
   - Click "Request Sponsorship"

3. **Transfer to Distribution**
   - On campaign detail page (FINANTAT state)
   - Click "Transfer to Distribution"

4. **Admin Panel**
   - Access comprehensive dashboard
   - View stats and manage contracts
   - Quick actions for common tasks

## Key Features in Detail

### Token Hub
- Live balance display
- Real-time token price
- Available supply tracking
- Simple purchase interface
- Transaction history (via events)

### Campaign Management
- Multiple campaign tracking
- Filter by state (Unfunded/Pre-Funded/Funded)
- Add campaigns by address
- Real-time progress visualization
- Contributor tracking

### Campaign Detail Page
- Live progress tracking
- State-based interactions
- Contribution management (deposit/withdraw)
- Owner controls (request sponsorship, transfer funds)
- Shareholder withdrawals
- Real-time activity feed
- Contract address information

### Admin Panel
- System-wide statistics
- Token management
- Sponsor balance tracking
- Campaign overview
- Quick actions

### Real-Time Updates
- Event listeners for all major contract events
- Live balance updates
- Activity feed with transaction details
- State change notifications

## Responsive Design

The DAPP is fully responsive and works on:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (320px - 767px)

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Brave

## Troubleshooting

### Wallet Connection Issues
- Make sure MetaMask is installed
- Check that you're on the correct network
- Try refreshing the page

### Transaction Failures
- Ensure sufficient ETH for gas
- Check token allowances
- Verify contract addresses are correct

### Contract Not Configured
- Update contract addresses in `src/contracts/addresses.ts`
- Rebuild the application

### Network Errors
- Verify Hardhat node is running
- Check RPC URL configuration
- Ensure firewall isn't blocking localhost

## Performance Optimization

- Code splitting by route
- Lazy loading of heavy components
- React Query caching
- Optimized re-renders
- Image optimization

## Security Considerations

- All transactions require wallet confirmation
- No private keys stored
- Contract addresses validated
- Input sanitization
- Error handling for all edge cases

## Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Netlify

```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Custom Server

```bash
npm run build
# Serve dist/ folder with any static file server
```

## Contributing

This is a demonstration project for a blockchain course. Feel free to use it as a reference or starting point for your own projects.

## License

MIT

## Support

For issues or questions about the smart contracts, refer to the main project README in the root directory.
