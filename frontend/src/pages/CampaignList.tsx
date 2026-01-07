import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { Card } from '@components/Common/Card';
import { Button } from '@components/Common/Button';
import { Input } from '@components/Common/Input';
import { StateBadge } from '@components/Campaign/StateBadge';
import { ProgressBar } from '@components/Campaign/ProgressBar';
import { useCampaigns } from '@hooks/useCampaigns';
import { useCampaignDetails } from '@hooks/useCampaignDetails';
import { useIsTokenOwner } from '@hooks/useIsOwner';
import { formatTokenAmount, shortenAddress } from '@utils/format';
import { CampaignState } from '@contracts/types';
import { useAccount } from 'wagmi';

const CampaignCard = ({ address }: { address: `0x${string}` }) => {
  const { fundingGoal, totalRaised, state } = useCampaignDetails(address);

  return (
    <Link to={`/campaign/${address}`}>
      <Card hover className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">Campaign</h3>
            <code className="text-xs text-gray-500">{shortenAddress(address)}</code>
          </div>
          {state !== undefined && <StateBadge state={state} />}
        </div>

        {fundingGoal && totalRaised !== undefined && (
          <>
            <div className="mb-4">
              <ProgressBar current={totalRaised} goal={fundingGoal} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Goal</p>
                <p className="font-semibold">{formatTokenAmount(fundingGoal)} FUND</p>
              </div>
              <div>
                <p className="text-gray-600">Raised</p>
                <p className="font-semibold">{formatTokenAmount(totalRaised)} FUND</p>
              </div>
            </div>
          </>
        )}
      </Card>
    </Link>
  );
};

const CampaignList = () => {
  const { isConnected } = useAccount();
  const { campaigns, addCampaign } = useCampaigns();
  const { isOwner } = useIsTokenOwner();
  const [searchAddress, setSearchAddress] = useState('');
  const [filterState, setFilterState] = useState<CampaignState | 'all'>('all');

  const handleAddCampaign = () => {
    if (searchAddress && searchAddress.startsWith('0x')) {
      addCampaign(searchAddress as `0x${string}`);
      setSearchAddress('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Campaigns</h1>
          <p className="text-gray-600">View and manage crowdfunding campaigns</p>
        </div>
        {isOwner && isConnected && (
          <Link to="/create-campaign">
            <Button icon={<Plus className="w-5 h-5" />}>
              Create Campaign
            </Button>
          </Link>
        )}
      </div>

      {/* Add Campaign */}
      <Card className="mb-8">
        <h3 className="font-semibold mb-4">Add Campaign by Address</h3>
        <div className="flex gap-2">
          <Input
            placeholder="0x..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <Button onClick={handleAddCampaign} disabled={!searchAddress.startsWith('0x')}>
            Add
          </Button>
        </div>
      </Card>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={filterState === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilterState('all')}
        >
          All
        </Button>
        <Button
          variant={filterState === CampaignState.NEFINANTAT ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilterState(CampaignState.NEFINANTAT)}
        >
          Unfunded
        </Button>
        <Button
          variant={filterState === CampaignState.PREFINANTAT ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilterState(CampaignState.PREFINANTAT)}
        >
          Pre-Funded
        </Button>
        <Button
          variant={filterState === CampaignState.FINANTAT ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilterState(CampaignState.FINANTAT)}
        >
          Funded
        </Button>
      </div>

      {/* Campaign Grid */}
      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((address) => (
            <CampaignCard key={address} address={address} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Campaigns Yet</h3>
          <p className="text-gray-600 mb-4">Add a campaign address above to get started</p>
          {isOwner && (
            <Link to="/create-campaign">
              <Button>Create New Campaign</Button>
            </Link>
          )}
        </Card>
      )}
    </div>
  );
};

export default CampaignList;

