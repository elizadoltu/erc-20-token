import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@utils/constants';
import { CampaignAddress } from '@contracts/addresses';

/**
 * Hook to manage multiple campaign addresses
 * Stores campaigns in local storage for persistence
 */
export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<CampaignAddress[]>([]);

  // Load campaigns from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CAMPAIGN_ADDRESSES);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCampaigns(parsed);
      } catch (error) {
        console.error('Error loading campaigns from storage:', error);
      }
    }
  }, []);

  // Save campaigns to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGN_ADDRESSES, JSON.stringify(campaigns));
  }, [campaigns]);

  const addCampaign = (address: CampaignAddress) => {
    if (!campaigns.includes(address)) {
      setCampaigns(prev => [...prev, address]);
    }
  };

  const removeCampaign = (address: CampaignAddress) => {
    setCampaigns(prev => prev.filter(addr => addr !== address));
  };

  const clearCampaigns = () => {
    setCampaigns([]);
  };

  return {
    campaigns,
    addCampaign,
    removeCampaign,
    clearCampaigns,
  };
};

