import FundingTokenAbi from './FundingToken.abi.json';
import CrowdFundingAbi from './CrowdFunding.abi.json';
import SponsorFundingAbi from './SponsorFunding.abi.json';
import DistributeFundingAbi from './DistributeFunding.abi.json';

export const FUNDING_TOKEN_ABI = FundingTokenAbi as const;
export const CROWD_FUNDING_ABI = CrowdFundingAbi as const;
export const SPONSOR_FUNDING_ABI = SponsorFundingAbi as const;
export const DISTRIBUTE_FUNDING_ABI = DistributeFundingAbi as const;

