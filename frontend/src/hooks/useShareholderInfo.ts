import { useReadContract } from 'wagmi';
import { DISTRIBUTE_FUNDING_ABI } from '@contracts/abis';

/**
 * Hook to get shareholder information
 */
export const useShareholderInfo = (distributionAddress?: `0x${string}`, shareholderAddress?: `0x${string}`) => {
  const { data: shareholderInfo } = useReadContract({
    address: distributionAddress,
    abi: DISTRIBUTE_FUNDING_ABI,
    functionName: 'getShareholderInfo',
    args: shareholderAddress ? [shareholderAddress] : undefined,
    query: {
      enabled: !!distributionAddress && !!shareholderAddress,
    },
  });

  // shareholderInfo is a tuple: [percentage, withdrawn, exists]
  const info = shareholderInfo as [bigint, boolean, boolean] | undefined;

  return {
    percentage: info ? Number(info[0]) : undefined,
    withdrawn: info ? info[1] : undefined,
    exists: info ? info[2] : undefined,
  };
};

/**
 * Hook to calculate shareholder's share amount
 */
export const useCalculateShare = (distributionAddress?: `0x${string}`, shareholderAddress?: `0x${string}`) => {
  const { data: shareAmount } = useReadContract({
    address: distributionAddress,
    abi: DISTRIBUTE_FUNDING_ABI,
    functionName: 'calculateShare',
    args: shareholderAddress ? [shareholderAddress] : undefined,
    query: {
      enabled: !!distributionAddress && !!shareholderAddress,
    },
  });

  return {
    shareAmount: shareAmount as bigint | undefined,
  };
};

/**
 * Hook to get total received funds in distribution contract
 */
export const useDistributionFunds = (distributionAddress?: `0x${string}`) => {
  const { data: totalReceived } = useReadContract({
    address: distributionAddress,
    abi: DISTRIBUTE_FUNDING_ABI,
    functionName: 'totalReceived',
    query: {
      enabled: !!distributionAddress,
    },
  });

  const { data: fundsReceived } = useReadContract({
    address: distributionAddress,
    abi: DISTRIBUTE_FUNDING_ABI,
    functionName: 'fundsReceived',
    query: {
      enabled: !!distributionAddress,
    },
  });

  return {
    totalReceived: totalReceived as bigint | undefined,
    fundsReceived: fundsReceived as boolean | undefined,
  };
};

/**
 * Hook to get total percentage allocated to shareholders
 */
export const useTotalPercentage = (distributionAddress?: `0x${string}`) => {
  const { data: totalPercentage } = useReadContract({
    address: distributionAddress,
    abi: DISTRIBUTE_FUNDING_ABI,
    functionName: 'getTotalPercentage',
    query: {
      enabled: !!distributionAddress,
    },
  });

  return {
    totalPercentage: totalPercentage ? Number(totalPercentage) : undefined,
  };
};

