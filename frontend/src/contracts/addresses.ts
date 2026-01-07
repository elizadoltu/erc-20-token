// Contract addresses - deployed on local Hardhat network
// Update these after each deployment

export const CONTRACTS = {
  FUNDING_TOKEN: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as `0x${string}`,
  CROWD_FUNDING: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9' as `0x${string}`,
  SPONSOR_FUNDING: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as `0x${string}`,
  DISTRIBUTE_FUNDING: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as `0x${string}`,
};

// Helper to check if contracts are configured
export const areContractsConfigured = () => {
  return Object.values(CONTRACTS).every(address => address && address.length > 0);
};

// For multi-campaign support, we'll track campaign addresses separately
export type CampaignAddress = `0x${string}`;

