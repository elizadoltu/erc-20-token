// Contract types and interfaces

export enum CampaignState {
  NEFINANTAT = 0,
  PREFINANTAT = 1,
  FINANTAT = 2,
}

export const CampaignStateLabels = {
  [CampaignState.NEFINANTAT]: 'Unfunded',
  [CampaignState.PREFINANTAT]: 'Pre-Funded',
  [CampaignState.FINANTAT]: 'Funded',
};

export const CampaignStateColors = {
  [CampaignState.NEFINANTAT]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  [CampaignState.PREFINANTAT]: 'bg-blue-100 text-blue-800 border-blue-300',
  [CampaignState.FINANTAT]: 'bg-green-100 text-green-800 border-green-300',
};

export interface Campaign {
  address: `0x${string}`;
  fundingGoal: bigint;
  totalRaised: bigint;
  state: CampaignState;
  owner: `0x${string}`;
  tokenContract: `0x${string}`;
  sponsorContract: `0x${string}`;
  distributionContract: `0x${string}`;
}

export interface Shareholder {
  address: `0x${string}`;
  percentage: number;
  withdrawn: boolean;
  exists: boolean;
}

export interface ContributionInfo {
  amount: bigint;
  contributor: `0x${string}`;
}

