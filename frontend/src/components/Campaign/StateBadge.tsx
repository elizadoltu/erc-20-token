import { CampaignState, CampaignStateLabels, CampaignStateColors } from '@contracts/types';

interface StateBadgeProps {
  state: CampaignState;
  size?: 'sm' | 'md' | 'lg';
}

export const StateBadge = ({ state, size = 'md' }: StateBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${CampaignStateColors[state]} ${sizeClasses[size]}`}
    >
      {CampaignStateLabels[state]}
    </span>
  );
};

