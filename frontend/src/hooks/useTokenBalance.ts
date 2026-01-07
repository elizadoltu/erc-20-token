import { useAccount, useReadContract, useBalance } from 'wagmi';
import { CONTRACTS } from '@contracts/addresses';
import { FUNDING_TOKEN_ABI } from '@contracts/abis';

/**
 * Hook to get user's token balance
 */
export const useTokenBalance = () => {
  const { address } = useAccount();
  
  const { data: balance, isLoading, refetch } = useReadContract({
    address: CONTRACTS.FUNDING_TOKEN,
    abi: FUNDING_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.FUNDING_TOKEN,
    },
  });

  return {
    balance: balance as bigint | undefined,
    isLoading,
    refetch,
  };
};

/**
 * Hook to get ETH balance
 */
export const useEthBalance = () => {
  const { address } = useAccount();
  
  const { data: balance, isLoading, refetch } = useBalance({
    address,
  });

  return {
    balance: balance?.value,
    formatted: balance?.formatted,
    isLoading,
    refetch,
  };
};

/**
 * Hook to get token price
 */
export const useTokenPrice = () => {
  const { data: price, isLoading } = useReadContract({
    address: CONTRACTS.FUNDING_TOKEN,
    abi: FUNDING_TOKEN_ABI,
    functionName: 'tokenPrice',
    query: {
      enabled: !!CONTRACTS.FUNDING_TOKEN,
    },
  });

  return {
    price: price as bigint | undefined,
    isLoading,
  };
};

/**
 * Hook to get total token supply
 */
export const useTotalSupply = () => {
  const { data: totalSupply, isLoading } = useReadContract({
    address: CONTRACTS.FUNDING_TOKEN,
    abi: FUNDING_TOKEN_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: !!CONTRACTS.FUNDING_TOKEN,
    },
  });

  return {
    totalSupply: totalSupply as bigint | undefined,
    isLoading,
  };
};

/**
 * Hook to get contract's available token balance
 */
export const useContractTokenBalance = () => {
  const { data: balance, isLoading, refetch } = useReadContract({
    address: CONTRACTS.FUNDING_TOKEN,
    abi: FUNDING_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [CONTRACTS.FUNDING_TOKEN],
    query: {
      enabled: !!CONTRACTS.FUNDING_TOKEN,
    },
  });

  return {
    balance: balance as bigint | undefined,
    isLoading,
    refetch,
  };
};

