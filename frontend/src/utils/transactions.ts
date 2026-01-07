/**
 * Transaction helper utilities
 */

import { BaseError, ContractFunctionRevertedError } from 'viem';

/**
 * Extract error message from contract error
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof BaseError) {
    const revertError = error.walk(err => err instanceof ContractFunctionRevertedError);
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName ?? '';
      return errorName || revertError.shortMessage;
    }
    return error.shortMessage;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};

/**
 * Check if error is a user rejection
 */
export const isUserRejection = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);
  return message.toLowerCase().includes('user rejected') || 
         message.toLowerCase().includes('user denied');
};

/**
 * Format transaction hash for display
 */
export const formatTxHash = (hash: string, chars = 6): string => {
  return `${hash.substring(0, chars + 2)}...${hash.substring(hash.length - chars)}`;
};

/**
 * Get block explorer URL for transaction
 */
export const getExplorerUrl = (hash: string, chainId: number): string => {
  // For local hardhat, return a placeholder
  if (chainId === 1337 || chainId === 31337) {
    return `#tx-${hash}`;
  }
  
  // For Sepolia
  if (chainId === 11155111) {
    return `https://sepolia.etherscan.io/tx/${hash}`;
  }
  
  // For mainnet
  if (chainId === 1) {
    return `https://etherscan.io/tx/${hash}`;
  }
  
  return `#tx-${hash}`;
};

/**
 * Get block explorer URL for address
 */
export const getAddressExplorerUrl = (address: string, chainId: number): string => {
  if (chainId === 1337 || chainId === 31337) {
    return `#address-${address}`;
  }
  
  if (chainId === 11155111) {
    return `https://sepolia.etherscan.io/address/${address}`;
  }
  
  if (chainId === 1) {
    return `https://etherscan.io/address/${address}`;
  }
  
  return `#address-${address}`;
};

