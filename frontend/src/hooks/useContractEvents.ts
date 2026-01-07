import { useEffect, useState } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { CROWD_FUNDING_ABI, FUNDING_TOKEN_ABI, DISTRIBUTE_FUNDING_ABI } from '@contracts/abis';

export interface ContractEvent {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  transactionHash: string;
}

/**
 * Hook to watch campaign events
 */
export const useCampaignEvents = (campaignAddress?: `0x${string}`) => {
  const [events, setEvents] = useState<ContractEvent[]>([]);

  // Watch Deposit events
  useWatchContractEvent({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    eventName: 'Deposit',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'Deposit',
          data: {
            contributor: log.args.contributor,
            amount: log.args.amount,
          },
          timestamp: Date.now(),
          transactionHash: log.transactionHash,
        };
        setEvents(prev => [event, ...prev].slice(0, 50)); // Keep last 50 events
      });
    },
    enabled: !!campaignAddress,
  });

  // Watch Withdrawal events
  useWatchContractEvent({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    eventName: 'Withdrawal',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'Withdrawal',
          data: {
            contributor: log.args.contributor,
            amount: log.args.amount,
          },
          timestamp: Date.now(),
          transactionHash: log.transactionHash,
        };
        setEvents(prev => [event, ...prev].slice(0, 50));
      });
    },
    enabled: !!campaignAddress,
  });

  // Watch StateChanged events
  useWatchContractEvent({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    eventName: 'StateChanged',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'StateChanged',
          data: {
            newState: log.args.newState,
          },
          timestamp: Date.now(),
          transactionHash: log.transactionHash,
        };
        setEvents(prev => [event, ...prev].slice(0, 50));
      });
    },
    enabled: !!campaignAddress,
  });

  // Watch GoalReached events
  useWatchContractEvent({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    eventName: 'GoalReached',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'GoalReached',
          data: {
            totalAmount: log.args.totalAmount,
          },
          timestamp: Date.now(),
          transactionHash: log.transactionHash,
        };
        setEvents(prev => [event, ...prev].slice(0, 50));
      });
    },
    enabled: !!campaignAddress,
  });

  // Watch SponsorshipReceived events
  useWatchContractEvent({
    address: campaignAddress,
    abi: CROWD_FUNDING_ABI,
    eventName: 'SponsorshipReceived',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'SponsorshipReceived',
          data: {
            amount: log.args.amount,
          },
          timestamp: Date.now(),
          transactionHash: log.transactionHash,
        };
        setEvents(prev => [event, ...prev].slice(0, 50));
      });
    },
    enabled: !!campaignAddress,
  });

  return { events };
};

/**
 * Hook to watch token transfer events
 */
export const useTokenEvents = (tokenAddress?: `0x${string}`, userAddress?: `0x${string}`) => {
  const [events, setEvents] = useState<ContractEvent[]>([]);

  useWatchContractEvent({
    address: tokenAddress,
    abi: FUNDING_TOKEN_ABI,
    eventName: 'Transfer',
    onLogs(logs) {
      logs.forEach((log: any) => {
        // Only track events involving the user
        if (
          userAddress &&
          (log.args.from?.toLowerCase() === userAddress.toLowerCase() ||
            log.args.to?.toLowerCase() === userAddress.toLowerCase())
        ) {
          const event: ContractEvent = {
            id: `${log.transactionHash}-${log.logIndex}`,
            type: 'Transfer',
            data: {
              from: log.args.from,
              to: log.args.to,
              amount: log.args.value,
            },
            timestamp: Date.now(),
            transactionHash: log.transactionHash,
          };
          setEvents(prev => [event, ...prev].slice(0, 50));
        }
      });
    },
    enabled: !!tokenAddress && !!userAddress,
  });

  return { events };
};

/**
 * Hook to watch distribution events
 */
export const useDistributionEvents = (distributionAddress?: `0x${string}`) => {
  const [events, setEvents] = useState<ContractEvent[]>([]);

  useWatchContractEvent({
    address: distributionAddress,
    abi: DISTRIBUTE_FUNDING_ABI,
    eventName: 'ShareWithdrawn',
    onLogs(logs) {
      logs.forEach((log: any) => {
        const event: ContractEvent = {
          id: `${log.transactionHash}-${log.logIndex}`,
          type: 'ShareWithdrawn',
          data: {
            shareholder: log.args.shareholder,
            amount: log.args.amount,
          },
          timestamp: Date.now(),
          transactionHash: log.transactionHash,
        };
        setEvents(prev => [event, ...prev].slice(0, 50));
      });
    },
    enabled: !!distributionAddress,
  });

  return { events };
};

