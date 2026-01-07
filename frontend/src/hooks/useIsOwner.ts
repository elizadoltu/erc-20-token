import { useAccount, useReadContract } from 'wagmi';
import { CONTRACTS } from '@contracts/addresses';
import { FUNDING_TOKEN_ABI, CROWD_FUNDING_ABI, SPONSOR_FUNDING_ABI, DISTRIBUTE_FUNDING_ABI } from '@contracts/abis';

/**
 * Hook to check if the connected user is the owner of a contract
 */
export const useIsOwner = (contractAddress?: `0x${string}`, contractType?: 'token' | 'crowdfunding' | 'sponsor' | 'distribution') => {
  const { address } = useAccount();
  
  // Determine which ABI to use
  let abi;
  let targetAddress = contractAddress;
  
  if (!contractAddress && contractType) {
    switch (contractType) {
      case 'token':
        targetAddress = CONTRACTS.FUNDING_TOKEN;
        abi = FUNDING_TOKEN_ABI;
        break;
      case 'crowdfunding':
        targetAddress = CONTRACTS.CROWD_FUNDING;
        abi = CROWD_FUNDING_ABI;
        break;
      case 'sponsor':
        targetAddress = CONTRACTS.SPONSOR_FUNDING;
        abi = SPONSOR_FUNDING_ABI;
        break;
      case 'distribution':
        targetAddress = CONTRACTS.DISTRIBUTE_FUNDING;
        abi = DISTRIBUTE_FUNDING_ABI;
        break;
    }
  } else if (contractAddress) {
    // Default to token ABI if not specified
    abi = FUNDING_TOKEN_ABI;
  }

  const { data: owner, isLoading } = useReadContract({
    address: targetAddress,
    abi: abi as any,
    functionName: 'owner',
    query: {
      enabled: !!targetAddress && !!address,
    },
  });

  const isOwner = owner && address ? (owner as string).toLowerCase() === address.toLowerCase() : false;

  return {
    isOwner,
    owner: owner as `0x${string}` | undefined,
    isLoading,
  };
};

/**
 * Hook to check if user is token contract owner
 */
export const useIsTokenOwner = () => {
  return useIsOwner(undefined, 'token');
};

