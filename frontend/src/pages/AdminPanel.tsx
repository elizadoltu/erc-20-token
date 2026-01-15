import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Coins, TrendingUp, Users, ExternalLink, Copy, Check } from 'lucide-react';
import { Card } from '@components/Common/Card';
import { Button } from '@components/Common/Button';
import { Input } from '@components/Common/Input';
import { Modal } from '@components/Common/Modal';
import { useIsTokenOwner } from '@hooks/useIsOwner';
import { useTokenBalance, useTotalSupply } from '@hooks/useTokenBalance';
import { useSponsorBalance } from '@hooks/useSponsorBalance';
import { useCampaigns } from '@hooks/useCampaigns';
import { useShareholderInfo } from '@hooks/useShareholderInfo';
import { formatTokenAmount, shortenAddress, formatEther } from '@utils/format';
import { CONTRACTS } from '@contracts/addresses';
import { parseEther } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { SPONSOR_FUNDING_ABI } from '@contracts/abis';
import { toast } from 'react-hot-toast';

const AdminPanel = () => {
  const { isOwner, isLoading } = useIsTokenOwner();
  const { balance: tokenBalance } = useTokenBalance();
  const { totalSupply } = useTotalSupply();
  const { balance: sponsorBalance, refetch: refetchSponsorBalance } = useSponsorBalance();
  const { campaigns } = useCampaigns();
  
  const [showBuyTokensModal, setShowBuyTokensModal] = useState(false);
  const [showDistributionModal, setShowDistributionModal] = useState(false);
  const [ethAmount, setEthAmount] = useState('');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast.success('Address copied!');
    setTimeout(() => setCopiedAddress(null), 2000);
  };
  
  const handleBuyTokensForSponsorship = async () => {
    if (!ethAmount || Number(ethAmount) <= 0) {
      toast.error('Please enter a valid ETH amount');
      return;
    }
    
    try {
      writeContract({
        address: CONTRACTS.SPONSOR_FUNDING,
        abi: SPONSOR_FUNDING_ABI,
        functionName: 'buyTokensForSponsorship',
        value: parseEther(ethAmount),
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to buy tokens');
    }
  };
  
  if (isSuccess) {
    toast.success('Tokens purchased for sponsorship!');
    refetchSponsorBalance();
    setShowBuyTokensModal(false);
    setEthAmount('');
  }

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
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleCopyAddress(CONTRACTS.FUNDING_TOKEN)}
              icon={copiedAddress === CONTRACTS.FUNDING_TOKEN ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            >
              {copiedAddress === CONTRACTS.FUNDING_TOKEN ? 'Copied!' : 'Copy Address'}
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
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowBuyTokensModal(true)}
            >
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
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowDistributionModal(true)}
            >
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
      
      {/* Buy Tokens for Sponsorship Modal */}
      <Modal
        isOpen={showBuyTokensModal}
        onClose={() => setShowBuyTokensModal(false)}
        title="Buy Tokens for Sponsorship"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Purchase tokens with ETH to fund the sponsorship contract. These tokens will be used to sponsor campaigns.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ETH Amount
            </label>
            <Input
              type="number"
              placeholder="0.0"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              min="0"
              step="0.001"
            />
            <p className="text-xs text-gray-500 mt-1">
              Token price: 0.001 ETH per token
            </p>
            {ethAmount && Number(ethAmount) > 0 && (
              <p className="text-sm text-primary-600 mt-2 font-medium">
                You will receive: ~{(Number(ethAmount) / 0.001).toFixed(2)} FUND tokens
              </p>
            )}
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Current Sponsor Balance:</strong> {sponsorBalance ? formatTokenAmount(sponsorBalance) : '0'} FUND
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowBuyTokensModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBuyTokensForSponsorship}
              disabled={!ethAmount || Number(ethAmount) <= 0 || isConfirming}
              className="flex-1"
            >
              {isConfirming ? 'Buying...' : 'Buy Tokens'}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Distribution Details Modal */}
      <DistributionDetailsModal
        isOpen={showDistributionModal}
        onClose={() => setShowDistributionModal(false)}
      />
    </div>
  );
};

// Distribution Details Modal Component
const DistributionDetailsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const shareholderAddresses = [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Account #0 - 50%
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', // Account #1 - 30%
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', // Account #2 - 20%
  ];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Distribution Details">
      <div className="space-y-4">
        <p className="text-gray-600">
          Shareholders configured in the distribution contract and their share percentages.
        </p>
        
        <div className="space-y-3">
          {shareholderAddresses.map((address, index) => (
            <ShareholderCard key={address} address={address as `0x${string}`} index={index} />
          ))}
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Distribution Contract</p>
          <code className="text-xs break-all">{CONTRACTS.DISTRIBUTE_FUNDING}</code>
        </div>
        
        <Button variant="outline" onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </Modal>
  );
};

// Shareholder Card Component
const ShareholderCard = ({ address, index }: { address: `0x${string}`; index: number }) => {
  const { percentage, hasWithdrawn } = useShareholderInfo(address);
  
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-500">Shareholder #{index + 1}</span>
            {hasWithdrawn && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                Withdrawn
              </span>
            )}
          </div>
          <code className="text-xs text-gray-600">{shortenAddress(address)}</code>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary-600">
            {percentage !== undefined ? percentage : '-'}%
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AdminPanel;

