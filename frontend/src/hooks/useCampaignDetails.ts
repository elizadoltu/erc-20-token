import { useReadContract } from 'wagmi';
import { CROWD_FUNDING_ABI } from '@contracts/abis';
import { CampaignState } from '@contracts/types';

/**
 * Hook to get campaign details
 */
export const useCampaignDetails = (campaignAddress?: `0x${string}`) => {
  const { data: fundingGoal } = useReadContract({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    functionName: 'fundingGoal',
    query: {
      enabled: !!campaignAddress,
    },
  });

  const { data: totalRaised, refetch: refetchTotalRaised } = useReadContract({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    functionName: 'totalRaised',
    query: {
      enabled: !!campaignAddress,
    },
  });

  const { data: stateValue, refetch: refetchState } = useReadContract({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    functionName: 'currentState',
    query: {
      enabled: !!campaignAddress,
    },
  });

  const { data: stateString } = useReadContract({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    functionName: 'getState',
    query: {
      enabled: !!campaignAddress,
    },
  });

  const { data: owner } = useReadContract({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    functionName: 'owner',
    query: {
      enabled: !!campaignAddress,
    },
  });

  const { data: tokenContract } = useReadContract({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    functionName: 'tokenContract',
    query: {
      enabled: !!campaignAddress,
    },
  });

  const { data: sponsorContract } = useReadContract({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    functionName: 'sponsorContract',
    query: {
      enabled: !!campaignAddress,
    },
  });

  const { data: distributionContract } = useReadContract({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    functionName: 'distributionContract',
    query: {
      enabled: !!campaignAddress,
    },
  });

  const refetch = () => {
    refetchTotalRaised();
    refetchState();
  };

  return {
    fundingGoal: fundingGoal as bigint | undefined,
    totalRaised: totalRaised as bigint | undefined,
    state: stateValue as CampaignState | undefined,
    stateString: stateString as string | undefined,
    owner: owner as `0x${string}` | undefined,
    tokenContract: tokenContract as `0x${string}` | undefined,
    sponsorContract: sponsorContract as `0x${string}` | undefined,
    distributionContract: distributionContract as `0x${string}` | undefined,
    refetch,
  };
};

/**
 * Hook to get user's contribution to a campaign
 */
export const useContribution = (campaignAddress?: `0x${string}`, userAddress?: `0x${string}`) => {
  const { data: contribution, refetch } = useReadContract({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    functionName: 'getContributorBalance',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!campaignAddress && !!userAddress,
    },
  });

  return {
    contribution: contribution as bigint | undefined,
    refetch,
  };
};

/**
 * Hook to get campaign's current balance
 */
export const useCampaignBalance = (campaignAddress?: `0x${string}`) => {
  const { data: balance, refetch } = useReadContract({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    functionName: 'getBalance',
    query: {
      enabled: !!campaignAddress,
    },
  });

  return {
    balance: balance as bigint | undefined,
    refetch,
  };
};

