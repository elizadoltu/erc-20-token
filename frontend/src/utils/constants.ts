import { CampaignState } from '@contracts/types';

// Token decimals
export const TOKEN_DECIMALS = 18;

// Default values
export const DEFAULT_GAS_LIMIT = 300000n;

// State labels and colors
export const STATE_LABELS: Record<CampaignState, string> = {
  [CampaignState.NEFINANTAT]: 'Unfunded',
  [CampaignState.PREFINANTAT]: 'Pre-Funded',
  [CampaignState.FINANTAT]: 'Funded',
};

export const STATE_DESCRIPTIONS: Record<CampaignState, string> = {
  [CampaignState.NEFINANTAT]: 'Campaign is actively accepting contributions',
  [CampaignState.PREFINANTAT]: 'Goal reached, awaiting sponsorship',
  [CampaignState.FINANTAT]: 'Campaign funded and ready for distribution',
};

// Transaction messages
export const TX_MESSAGES = {
  PENDING: 'Transaction pending...',
  SUCCESS: 'Transaction successful!',
  ERROR: 'Transaction failed',
  REJECTED: 'Transaction rejected by user',
};

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  INVALID_AMOUNT: 'Invalid amount',
  CONTRACT_NOT_CONFIGURED: 'Contract not configured',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred',
};

// Success messages
export const SUCCESS_MESSAGES = {
  TOKENS_PURCHASED: 'Tokens purchased successfully!',
  TOKENS_DEPOSITED: 'Tokens deposited to campaign!',
  TOKENS_WITHDRAWN: 'Tokens withdrawn successfully!',
  SPONSORSHIP_REQUESTED: 'Sponsorship requested!',
  CAMPAIGN_CREATED: 'Campaign created successfully!',
  SHARE_WITHDRAWN: 'Share withdrawn successfully!',
  FUNDS_TRANSFERRED: 'Funds transferred to distribution!',
};

// Local storage keys
export const STORAGE_KEYS = {
  CAMPAIGN_ADDRESSES: 'crowdfunding_campaign_addresses',
  USER_PREFERENCES: 'crowdfunding_user_preferences',
};

