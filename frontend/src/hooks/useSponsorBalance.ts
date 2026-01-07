import { useReadContract } from 'wagmi';
import { SPONSOR_FUNDING_ABI } from '@contracts/abis';
import { CONTRACTS } from '@contracts/addresses';

/**
 * Hook to get sponsor contract's available balance
 */
export const useSponsorBalance = (sponsorAddress?: `0x${string}`) => {
  const targetAddress = sponsorAddress || CONTRACTS.SPONSOR_FUNDING;
  
  const { data: balance, refetch } = useReadContract({
    address: targetAddress,
    abi: SPONSOR_FUNDING_ABI,
    functionName: 'getAvailableBalance',
    query: {
      enabled: !!targetAddress,
    },
  });

  return {
    balance: balance as bigint | undefined,
    refetch,
  };
};

/**
 * Hook to get sponsor percentage
 */
export const useSponsorPercentage = (sponsorAddress?: `0x${string}`) => {
  const targetAddress = sponsorAddress || CONTRACTS.SPONSOR_FUNDING;
  
  const { data: percentage } = useReadContract({
    address: targetAddress,
    abi: SPONSOR_FUNDING_ABI,
    functionName: 'sponsorPercentage',
    query: {
      enabled: !!targetAddress,
    },
  });

  return {
    percentage: percentage ? Number(percentage) : undefined,
  };
};

