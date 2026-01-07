import { Github, Twitter, Globe } from 'lucide-react';
import { CONTRACTS, areContractsConfigured } from '@contracts/addresses';
import { shortenAddress } from '@utils/format';

export const Footer = () => {
  const contractsConfigured = areContractsConfigured();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">About</h3>
            <p className="text-sm text-gray-400">
              A decentralized crowdfunding platform built on Ethereum with ERC-20 tokens,
              sponsorship mechanisms, and fair distribution to shareholders.
            </p>
          </div>

          {/* Contract Addresses */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Smart Contracts</h3>
            {contractsConfigured ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Token:</span>
                  <code className="text-primary-400">{shortenAddress(CONTRACTS.FUNDING_TOKEN)}</code>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Crowdfunding:</span>
                  <code className="text-primary-400">{shortenAddress(CONTRACTS.CROWD_FUNDING)}</code>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Sponsor:</span>
                  <code className="text-primary-400">{shortenAddress(CONTRACTS.SPONSOR_FUNDING)}</code>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Distribution:</span>
                  <code className="text-primary-400">{shortenAddress(CONTRACTS.DISTRIBUTE_FUNDING)}</code>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Contracts not configured</p>
            )}
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} CrowdFund DAPP. Built with Ethereum & React.</p>
        </div>
      </div>
    </footer>
  );
};

