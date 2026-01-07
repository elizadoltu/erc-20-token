import { formatUnits, parseUnits } from 'viem';

/**
 * Format an Ethereum address to show first and last characters
 */
export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

/**
 * Format token amount from wei to human-readable format
 */
export const formatTokenAmount = (amount: bigint, decimals = 18, maxDecimals = 4): string => {
  const formatted = formatUnits(amount, decimals);
  const num = parseFloat(formatted);
  
  if (num === 0) return '0';
  if (num < 0.0001) return '< 0.0001';
  
  return num.toLocaleString('en-US', {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: 0,
  });
};

/**
 * Format ETH amount
 */
export const formatEth = (amount: bigint, maxDecimals = 4): string => {
  return formatTokenAmount(amount, 18, maxDecimals);
};

/**
 * Parse token amount to wei
 */
export const parseTokenAmount = (amount: string, decimals = 18): bigint => {
  try {
    return parseUnits(amount, decimals);
  } catch {
    return BigInt(0);
  }
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Calculate percentage of two bigints
 */
export const calculatePercentage = (part: bigint, total: bigint): number => {
  if (total === BigInt(0)) return 0;
  return Number((part * BigInt(10000)) / total) / 100;
};

/**
 * Format timestamp to readable date
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp * 1000;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

