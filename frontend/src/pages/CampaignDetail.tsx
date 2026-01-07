import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ArrowLeft, TrendingUp, Users, Award } from 'lucide-react';
import { Card } from '@components/Common/Card';
import { Button } from '@components/Common/Button';
import { Input } from '@components/Common/Input';
import { StateBadge } from '@components/Campaign/StateBadge';
import { ProgressBar } from '@components/Campaign/ProgressBar';
import { Loading } from '@components/Common/Loading';
import { useCampaignDetails, useContribution } from '@hooks/useCampaignDetails';
import { useTokenBalance } from '@hooks/useTokenBalance';
import { useShareholderInfo, useCalculateShare } from '@hooks/useShareholderInfo';
import { useCampaignEvents } from '@hooks/useContractEvents';
import { CROWD_FUNDING_ABI, FUNDING_TOKEN_ABI, DISTRIBUTE_FUNDING_ABI } from '@contracts/abis';
import { CONTRACTS } from '@contracts/addresses';
import { formatTokenAmount, shortenAddress } from '@utils/format';
import { parseTokenAmount } from '@utils/format';
import { CampaignState } from '@contracts/types';

const CampaignDetail = () => {
  const { address: campaignAddress } = useParams<{ address: `0x${string}` }>();
  const { address: userAddress, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const campaign = useCampaignDetails(campaignAddress as `0x${string}`);
  const { balance: tokenBalance } = useTokenBalance();
  const { contribution, refetch: refetchContribution } = useContribution(
    campaignAddress as `0x${string}`,
    userAddress
  );
  const { events } = useCampaignEvents(campaignAddress as `0x${string}`);

  const { exists: isShareholder, percentage, withdrawn } = useShareholderInfo(
    campaign.distributionContract,
    userAddress
  );
  const { shareAmount } = useCalculateShare(campaign.distributionContract, userAddress);

  const { writeContract: approveWrite, data: approveHash } = useWriteContract();
  const { writeContract: depositWrite, data: depositHash, isPending: isDepositPending } = useWriteContract();
  const { writeContract: withdrawWrite, data: withdrawHash, isPending: isWithdrawPending } = useWriteContract();
  const { writeContract: requestSponsorWrite, isPending: isSponsorPending } = useWriteContract();
  const { writeContract: transferWrite, isPending: isTransferPending } = useWriteContract();
  const { writeContract: withdrawShareWrite, isPending: isSharePending } = useWriteContract();

  const { isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isSuccess: depositSuccess } = useWaitForTransactionReceipt({ hash: depositHash });
  const { isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash });

  // Refetch on successful transactions
  if (depositSuccess || withdrawSuccess) {
    campaign.refetch();
    refetchContribution();
  }

  const handleApprove = async () => {
    if (!depositAmount || !campaignAddress) return;
    const amount = parseTokenAmount(depositAmount);
    approveWrite({
      address: CONTRACTS.FUNDING_TOKEN,
      abi: FUNDING_TOKEN_ABI,
      functionName: 'approve',
      args: [campaignAddress as `0x${string}`, amount],
    });
  };

  const handleDeposit = async () => {
    if (!depositAmount || !campaignAddress) return;
    const amount = parseTokenAmount(depositAmount);
    depositWrite({
      address: campaignAddress as `0x${string}`,
      abi: CROWD_FUNDING_ABI,
      functionName: 'deposit',
      args: [amount],
    });
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !campaignAddress) return;
    const amount = withdrawAmount ? parseTokenAmount(withdrawAmount) : BigInt(0);
    withdrawWrite({
      address: campaignAddress as `0x${string}`,
      abi: CROWD_FUNDING_ABI,
      functionName: 'withdraw',
      args: [amount],
    });
  };

  const handleRequestSponsorship = () => {
    requestSponsorWrite({
      address: campaignAddress as `0x${string}`,
      abi: CROWD_FUNDING_ABI,
      functionName: 'requestSponsorship',
    });
  };

  const handleTransferToDistribution = () => {
    transferWrite({
      address: campaignAddress as `0x${string}`,
      abi: CROWD_FUNDING_ABI,
      functionName: 'transferToDistribution',
    });
  };

  const handleWithdrawShare = () => {
    withdrawShareWrite({
      address: campaign.distributionContract!,
      abi: DISTRIBUTE_FUNDING_ABI,
      functionName: 'withdrawShare',
    });
  };

  if (!campaignAddress) return <div>Invalid campaign address</div>;

  const isOwner = userAddress && campaign.owner && userAddress.toLowerCase() === campaign.owner.toLowerCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/campaigns" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Campaigns
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Header */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Campaign Details</h1>
                <code className="text-sm text-gray-500">{campaignAddress}</code>
              </div>
              {campaign.state !== undefined && <StateBadge state={campaign.state} size="lg" />}
            </div>

            {campaign.fundingGoal && campaign.totalRaised !== undefined && (
              <>
                <ProgressBar current={campaign.totalRaised} goal={campaign.fundingGoal} size="lg" />
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-gray-600 mb-1">Funding Goal</p>
                    <p className="text-2xl font-bold">{formatTokenAmount(campaign.fundingGoal)} FUND</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Total Raised</p>
                    <p className="text-2xl font-bold">{formatTokenAmount(campaign.totalRaised)} FUND</p>
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* Contribution Section */}
          {campaign.state === CampaignState.NEFINANTAT && isConnected && (
            <Card>
              <h2 className="text-2xl font-bold mb-4">Contribute</h2>
              <div className="space-y-4">
                <Input
                  label="Amount (FUND)"
                  type="number"
                  placeholder="0.0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  helperText={`Your balance: ${tokenBalance ? formatTokenAmount(tokenBalance) : '0'} FUND`}
                />
                <div className="flex gap-2">
                  <Button onClick={handleApprove} className="flex-1" disabled={!depositAmount}>
                    {approveSuccess ? '✓ Approved' : 'Approve'}
                  </Button>
                  <Button
                    onClick={handleDeposit}
                    className="flex-1"
                    disabled={!approveSuccess || !depositAmount}
                    isLoading={isDepositPending}
                  >
                    Deposit
                  </Button>
                </div>

                {contribution && contribution > BigInt(0) && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Your Contribution</p>
                    <p className="text-xl font-bold mb-4">{formatTokenAmount(contribution)} FUND</p>
                    <Input
                      placeholder="Amount to withdraw"
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <Button
                      onClick={handleWithdraw}
                      variant="secondary"
                      className="w-full mt-2"
                      isLoading={isWithdrawPending}
                    >
                      Withdraw
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Owner Actions - Sponsorship */}
          {isOwner && campaign.state === CampaignState.PREFINANTAT && (
            <Card>
              <h2 className="text-2xl font-bold mb-4">Request Sponsorship</h2>
              <p className="text-gray-600 mb-4">
                Campaign has reached its goal. Request sponsorship to add additional funding.
              </p>
              <Button onClick={handleRequestSponsorship} isLoading={isSponsorPending}>
                Request Sponsorship
              </Button>
            </Card>
          )}

          {/* Owner Actions - Distribution */}
          {isOwner && campaign.state === CampaignState.FINANTAT && (
            <Card>
              <h2 className="text-2xl font-bold mb-4">Transfer to Distribution</h2>
              <p className="text-gray-600 mb-4">
                Campaign is fully funded. Transfer the total amount to the distribution contract.
              </p>
              <Button onClick={handleTransferToDistribution} isLoading={isTransferPending}>
                Transfer to Distribution
              </Button>
            </Card>
          )}

          {/* Shareholder Withdrawal */}
          {isShareholder && shareAmount && shareAmount > BigInt(0) && (
            <Card>
              <h2 className="text-2xl font-bold mb-4">Your Share</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Your Percentage</p>
                  <p className="text-2xl font-bold">{percentage}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Share Amount</p>
                  <p className="text-2xl font-bold">{formatTokenAmount(shareAmount)} FUND</p>
                </div>
                {!withdrawn && (
                  <Button onClick={handleWithdrawShare} isLoading={isSharePending}>
                    Withdraw Share
                  </Button>
                )}
                {withdrawn && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800 font-medium">✓ Share already withdrawn</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Activity Feed */}
          {events.length > 0 && (
            <Card>
              <h2 className="text-2xl font-bold mb-4">Activity</h2>
              <div className="space-y-3">
                {events.slice(0, 10).map((event) => (
                  <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{event.type}</p>
                        {event.data.amount && (
                          <p className="text-sm text-gray-600">
                            Amount: {formatTokenAmount(event.data.amount)} FUND
                          </p>
                        )}
                      </div>
                      <code className="text-xs text-gray-500">{shortenAddress(event.transactionHash)}</code>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold mb-4">Contract Addresses</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Campaign</p>
                <code className="text-xs">{shortenAddress(campaignAddress)}</code>
              </div>
              {campaign.tokenContract && (
                <div>
                  <p className="text-gray-600">Token</p>
                  <code className="text-xs">{shortenAddress(campaign.tokenContract)}</code>
                </div>
              )}
              {campaign.sponsorContract && (
                <div>
                  <p className="text-gray-600">Sponsor</p>
                  <code className="text-xs">{shortenAddress(campaign.sponsorContract)}</code>
                </div>
              )}
              {campaign.distributionContract && (
                <div>
                  <p className="text-gray-600">Distribution</p>
                  <code className="text-xs">{shortenAddress(campaign.distributionContract)}</code>
                </div>
              )}
            </div>
          </Card>

          {isOwner && (
            <Card className="bg-primary-50 border-primary-200">
              <p className="text-primary-800 font-medium">✓ You own this campaign</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;

