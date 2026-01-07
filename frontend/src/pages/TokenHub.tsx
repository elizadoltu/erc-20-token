import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Coins, TrendingUp, Wallet as WalletIcon } from 'lucide-react';
import { Card } from '@components/Common/Card';
import { Button } from '@components/Common/Button';
import { Input } from '@components/Common/Input';
import { Loading } from '@components/Common/Loading';
import { useTokenBalance, useTokenPrice, useTotalSupply, useContractTokenBalance, useEthBalance } from '@hooks/useTokenBalance';
import { CONTRACTS } from '@contracts/addresses';
import { FUNDING_TOKEN_ABI } from '@contracts/abis';
import { formatTokenAmount, formatEth, parseTokenAmount } from '@utils/format';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@utils/constants';

const TokenHub = () => {
  const { address, isConnected } = useAccount();
  const [ethAmount, setEthAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { balance, refetch: refetchBalance } = useTokenBalance();
  const { balance: ethBalance } = useEthBalance();
  const { price: tokenPrice } = useTokenPrice();
  const { totalSupply } = useTotalSupply();
  const { balance: availableTokens } = useContractTokenBalance();

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleBuyTokens = async () => {
    if (!ethAmount || !isConnected) return;

    try {
      writeContract({
        address: CONTRACTS.FUNDING_TOKEN,
        abi: FUNDING_TOKEN_ABI,
        functionName: 'buyTokens',
        value: parseEther(ethAmount),
      });
    } catch (err) {
      console.error('Error buying tokens:', err);
    }
  };

  // Refetch balance after successful transaction
  if (isSuccess && !showSuccess) {
    setShowSuccess(true);
    refetchBalance();
    setEthAmount('');
    setTimeout(() => setShowSuccess(false), 3000);
  }

  // Calculate tokens to receive
  const calculateTokensToReceive = () => {
    if (!ethAmount || !tokenPrice) return BigInt(0);
    try {
      const ethValue = parseEther(ethAmount);
      return (ethValue * BigInt(10 ** 18)) / tokenPrice;
    } catch {
      return BigInt(0);
    }
  };

  const tokensToReceive = calculateTokensToReceive();

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center py-12">
          <WalletIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access the Token Hub</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Token Hub</h1>
        <p className="text-gray-600">Buy and manage your FUND tokens</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Your Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {balance ? formatTokenAmount(balance) : '0'} FUND
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <Coins className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Token Price</p>
              <p className="text-2xl font-bold text-gray-900">
                {tokenPrice ? formatEth(tokenPrice) : '0'} ETH
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available Tokens</p>
              <p className="text-2xl font-bold text-gray-900">
                {availableTokens ? formatTokenAmount(availableTokens) : '0'}
              </p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-lg">
              <WalletIcon className="w-8 h-8 text-secondary-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Purchase Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Buy Tokens</h2>
          
          <div className="space-y-4">
            <Input
              type="number"
              step="0.01"
              min="0"
              label="ETH Amount"
              placeholder="0.0"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              helperText={`Your ETH Balance: ${ethBalance ? formatEth(ethBalance) : '0'} ETH`}
            />

            {tokensToReceive > BigInt(0) && (
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <p className="text-sm text-gray-600 mb-1">You will receive</p>
                <p className="text-2xl font-bold text-primary-600">
                  {formatTokenAmount(tokensToReceive)} FUND
                </p>
              </div>
            )}

            {showSuccess && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800 font-medium">{SUCCESS_MESSAGES.TOKENS_PURCHASED}</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-800 text-sm">{error.message}</p>
              </div>
            )}

            <Button
              onClick={handleBuyTokens}
              className="w-full"
              disabled={!ethAmount || parseFloat(ethAmount) <= 0}
              isLoading={isPending || isConfirming}
            >
              {isPending || isConfirming ? 'Processing...' : 'Buy Tokens'}
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Token Information</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Token Symbol</span>
              <span className="font-semibold">FUND</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Decimals</span>
              <span className="font-semibold">18</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Total Supply</span>
              <span className="font-semibold">{totalSupply ? formatTokenAmount(totalSupply) : '0'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Price per Token</span>
              <span className="font-semibold">{tokenPrice ? formatEth(tokenPrice) : '0'} ETH</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Contract</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {CONTRACTS.FUNDING_TOKEN.substring(0, 10)}...
              </code>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TokenHub;

