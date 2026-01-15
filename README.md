# ERC-20 Crowdfunding System

A comprehensive Solidity-based crowdfunding system with token-based contributions, percentage-based sponsorship, and proportional distribution to shareholders.

## Overview

This project implements a complete crowdfunding ecosystem consisting of four smart contracts:

1. **FundingToken** - Custom ERC-20 token with purchase functionality
2. **CrowdFunding** - Core crowdfunding contract with state management
3. **SponsorFunding** - Sponsorship provider with percentage-based contributions
4. **DistributeFunding** - Distribution manager for shareholders

## Features

### FundingToken
- Full ERC-20 implementation (transfer, approve, transferFrom, balanceOf, allowance)
- Direct token purchase with ETH at a fixed price
- Pre-minted supply held by the contract
- Owner can withdraw ETH from token sales

### CrowdFunding
Three distinct states:
- **NEFINANTAT** (Unfunded) - Before reaching the funding goal
  - Contributors can deposit tokens
  - Contributors can withdraw tokens at any time
  - State transitions to PREFINANTAT when goal is reached
  
- **PREFINANTAT** (Pre-funded) - After reaching goal, before sponsorship
  - No deposits or withdrawals allowed
  - Owner can request sponsorship
  - State transitions to FINANTAT after sponsorship request
  
- **FINANTAT** (Funded) - After sponsorship
  - Owner can transfer funds to distribution contract

### SponsorFunding
- Configurable percentage-based sponsorship (e.g., 10% = adds 10% to raised amount)
- Owner can purchase tokens for sponsorship using ETH
- Automatically calculates and provides sponsorship when requested
- Fails gracefully if insufficient balance

### DistributeFunding
- Supports multiple shareholders with percentage allocations (0-100%)
- Total percentage can be ≤100% (remaining funds stay in contract)
- Each shareholder can withdraw their share once
- Prevents double withdrawal
- Owner can add shareholders before funds are received

## Architecture

```
┌──────────────┐     ┌──────────────┐
│ Contributors │────▶│ FundingToken │
└──────────────┘     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ CrowdFunding │
                     │              │
                     │ States:      │
                     │ 1.NEFINANTAT │
                     │ 2.PREFINANTAT│
                     │ 3.FINANTAT   │
                     └──┬────────┬──┘
                        │        │
         ┌──────────────┘        └──────────────┐
         │                                       │
         ▼                                       ▼
┌──────────────────┐                  ┌──────────────────┐
│ SponsorFunding   │                  │ DistributeFunding│
│                  │                  │                  │
│ Provides         │                  │ Distributes to   │
│ Sponsorship      │                  │ Shareholders     │
└──────────────────┘                  └──────────────────┘
```

## Installation

```bash
npm install
```

## Compilation

```bash
npx hardhat compile
```

## Testing

Run the comprehensive test suite (27 tests):

```bash
npx hardhat test
```

## Deployment

Deploy all contracts with default configuration:

```bash
npx hardhat run scripts/deploy.ts
```

Default deployment parameters:
- Initial Supply: 1,000,000 tokens
- Token Price: 0.001 ETH per token
- Funding Goal: 10,000 tokens
- Sponsor Percentage: 10%

## Usage Example

### 1. Setup Phase
```javascript
// Deploy all contracts
const fundingToken = await FundingToken.deploy(initialSupply, tokenPrice);
const distributeFunding = await DistributeFunding.deploy(tokenAddress);
const sponsorFunding = await SponsorFunding.deploy(percentage, tokenAddress);
const crowdFunding = await CrowdFunding.deploy(
  fundingGoal,
  tokenAddress,
  sponsorAddress,
  distributeAddress
);

// Add shareholders
await distributeFunding.addShareholder(shareholder1, 50); // 50%
await distributeFunding.addShareholder(shareholder2, 30); // 30%
await distributeFunding.addShareholder(shareholder3, 20); // 20%

// Fund sponsor contract
await sponsorFunding.buyTokensForSponsorship({ value: ethers.parseEther("5") });
```

### 2. Contribution Phase (NEFINANTAT)
```javascript
// Contributors buy tokens
await fundingToken.connect(contributor1).buyTokens({ value: ethers.parseEther("5") });

// Contributors approve and deposit
await fundingToken.connect(contributor1).approve(crowdFundingAddress, amount);
await crowdFunding.connect(contributor1).deposit(amount);

// Contributors can withdraw before goal is reached
await crowdFunding.connect(contributor1).withdraw(amount);
```

### 3. Sponsorship Phase (PREFINANTAT)
```javascript
// Check state
const state = await crowdFunding.getState(); // "prefinantat"

// Owner requests sponsorship
await crowdFunding.connect(owner).requestSponsorship();
// State automatically transitions to FINANTAT
```

### 4. Distribution Phase (FINANTAT)
```javascript
// Owner transfers funds to distribution
await crowdFunding.connect(owner).transferToDistribution();
await distributeFunding.receiveFunds(totalAmount);

// Shareholders withdraw their shares
await distributeFunding.connect(shareholder1).withdrawShare();
await distributeFunding.connect(shareholder2).withdrawShare();
await distributeFunding.connect(shareholder3).withdrawShare();
```

## Smart Contract Details

### FundingToken.sol
- **Constructor**: `constructor(uint256 initialSupply, uint256 tokenPrice)`
- **Key Functions**:
  - `buyTokens()` - Purchase tokens with ETH
  - `transfer(address to, uint256 amount)`
  - `approve(address spender, uint256 amount)`
  - `transferFrom(address from, address to, uint256 amount)`

### CrowdFunding.sol
- **Constructor**: `constructor(uint256 fundingGoal, address tokenContract, address sponsorContract, address distributionContract)`
- **Key Functions**:
  - `deposit(uint256 amount)` - Deposit tokens (NEFINANTAT only)
  - `withdraw(uint256 amount)` - Withdraw tokens (NEFINANTAT only)
  - `requestSponsorship()` - Request sponsorship (PREFINANTAT only, owner only)
  - `transferToDistribution()` - Transfer to distribution (FINANTAT only, owner only)
  - `getState()` - Returns current state as string

### SponsorFunding.sol
- **Constructor**: `constructor(uint256 sponsorPercentage, address tokenContract)`
- **Key Functions**:
  - `buyTokensForSponsorship()` - Purchase tokens for sponsorship (owner only)
  - `sponsorCrowdfunding(address crowdfundingAddress)` - Provide sponsorship
  - `getAvailableBalance()` - Query available tokens

### DistributeFunding.sol
- **Constructor**: `constructor(address tokenContract)`
- **Key Functions**:
  - `addShareholder(address addr, uint256 percentage)` - Add shareholder (owner only, before funds)
  - `receiveFunds(uint256 amount)` - Mark funds as received (owner only)
  - `withdrawShare()` - Withdraw shareholder's portion
  - `calculateShare(address addr)` - Calculate share amount
  - `getTotalPercentage()` - Get total allocated percentage

## Security Features

- Owner-only functions for administrative operations
- State-based access control (prevents out-of-order operations)
- Reentrancy protection (checks-effects-interactions pattern)
- Double-withdrawal prevention for shareholders
- Balance verification before transfers
- Comprehensive input validation

## Test Coverage

The test suite covers:
- ✓ FundingToken: Purchase, transfer, approve/transferFrom
- ✓ CrowdFunding: Deposits, withdrawals, state transitions
- ✓ SponsorFunding: Token purchase, sponsorship provision
- ✓ DistributeFunding: Shareholder management, distribution, withdrawal
- ✓ Integration: Full end-to-end crowdfunding cycle
- ✓ Edge cases: Partial shareholder allocation, failed sponsorship

## Technology Stack

- **Solidity**: ^0.8.20
- **Hardhat**: Development environment
- **TypeScript**: Testing and scripts
- **Ethers.js v6**: Ethereum library
- **Chai**: Testing assertions

## License

MIT

## Project Structure

```
erc-20-token/
├── contracts/
│   ├── FundingToken.sol
│   ├── CrowdFunding.sol
│   ├── SponsorFunding.sol
│   └── DistributeFunding.sol
├── test/
│   └── FundingSystem.test.ts
├── scripts/
│   └── deploy.ts
├── hardhat.config.ts
├── tsconfig.json
├── package.json
└── README.md
```