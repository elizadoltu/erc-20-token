import { Link } from 'react-router-dom';
import { Settings, Coins, TrendingUp, Users } from 'lucide-react';
import { Card } from '@components/Common/Card';
import { Button } from '@components/Common/Button';
import { useIsTokenOwner } from '@hooks/useIsOwner';
import { useTokenBalance, useTotalSupply } from '@hooks/useTokenBalance';
import { useSponsorBalance } from '@hooks/useSponsorBalance';
import { useCampaigns } from '@hooks/useCampaigns';
import { formatTokenAmount, shortenAddress } from '@utils/format';
import { CONTRACTS } from '@contracts/addresses';

const AdminPanel = () => {
  const { isOwner, isLoading } = useIsTokenOwner();
  const { balance: tokenBalance } = useTokenBalance();
  const { totalSupply } = useTotalSupply();
  const { balance: sponsorBalance } = useSponsorBalance();
  const { campaigns } = useCampaigns();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center py-12">
          <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Owner Only</h2>
          <p className="text-gray-600">Only the contract owner can access the admin panel</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage contracts and system settings</p>
        </div>
        <Link to="/create-campaign">
          <Button>Create Campaign</Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Your Token Balance</p>
              <p className="text-xl font-bold">
                {tokenBalance ? formatTokenAmount(tokenBalance) : '0'}
              </p>
            </div>
            <Coins className="w-8 h-8 text-primary-600" />
          </div>
        </Card>

        <Card gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Supply</p>
              <p className="text-xl font-bold">
                {totalSupply ? formatTokenAmount(totalSupply) : '0'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sponsor Balance</p>
              <p className="text-xl font-bold">
                {sponsorBalance ? formatTokenAmount(sponsorBalance) : '0'}
              </p>
            </div>
            <Users className="w-8 h-8 text-secondary-600" />
          </div>
        </Card>

        <Card gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Campaigns</p>
              <p className="text-xl font-bold">{campaigns.length}</p>
            </div>
            <Settings className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Token Management */}
        <Card>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Coins className="w-6 h-6 mr-2 text-primary-600" />
            Token Management
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Token Contract</p>
              <code className="text-xs">{shortenAddress(CONTRACTS.FUNDING_TOKEN)}</code>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Supply</p>
              <p className="font-semibold">{totalSupply ? formatTokenAmount(totalSupply) : '0'} FUND</p>
            </div>
            <Button variant="outline" className="w-full">
              View on Explorer
            </Button>
          </div>
        </Card>

        {/* Sponsor Management */}
        <Card>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
            Sponsor Management
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Sponsor Contract</p>
              <code className="text-xs">{shortenAddress(CONTRACTS.SPONSOR_FUNDING)}</code>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="font-semibold">{sponsorBalance ? formatTokenAmount(sponsorBalance) : '0'} FUND</p>
            </div>
            <Button variant="outline" className="w-full">
              Buy Tokens for Sponsorship
            </Button>
          </div>
        </Card>

        {/* Campaign Management */}
        <Card>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-secondary-600" />
            Campaign Management
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Campaigns</p>
              <p className="font-semibold">{campaigns.length}</p>
            </div>
            <Link to="/campaigns">
              <Button variant="outline" className="w-full">
                View All Campaigns
              </Button>
            </Link>
            <Link to="/create-campaign">
              <Button className="w-full">
                Create New Campaign
              </Button>
            </Link>
          </div>
        </Card>

        {/* Distribution Management */}
        <Card>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Settings className="w-6 h-6 mr-2 text-orange-600" />
            Distribution Management
          </h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Distribution Contract</p>
              <code className="text-xs">{shortenAddress(CONTRACTS.DISTRIBUTE_FUNDING)}</code>
            </div>
            <Button variant="outline" className="w-full">
              View Distribution Details
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/tokens">
            <Button variant="outline" className="w-full">
              Buy Tokens
            </Button>
          </Link>
          <Link to="/campaigns">
            <Button variant="outline" className="w-full">
              Manage Campaigns
            </Button>
          </Link>
          <Link to="/create-campaign">
            <Button className="w-full">
              Create Campaign
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminPanel;

