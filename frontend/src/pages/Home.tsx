import { Link } from 'react-router-dom';
import { Rocket, TrendingUp, Users, Shield } from 'lucide-react';
import { Card } from '@components/Common/Card';
import { Button } from '@components/Common/Button';
import { useAccount } from 'wagmi';

const Home = () => {
  const { isConnected } = useAccount();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6 animate-fade-in">
          Decentralized Crowdfunding
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Fund your projects with ERC-20 tokens, enjoy sponsorship benefits, and distribute
          rewards fairly to all stakeholders.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/tokens">
            <Button size="lg">Get Tokens</Button>
          </Link>
          <Link to="/campaigns">
            <Button variant="outline" size="lg">View Campaigns</Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card hover className="text-center">
          <div className="p-4 bg-primary-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Rocket className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Launch Campaigns</h3>
          <p className="text-gray-600 text-sm">
            Create and manage multiple crowdfunding campaigns with ease
          </p>
        </Card>

        <Card hover className="text-center">
          <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Get Sponsored</h3>
          <p className="text-gray-600 text-sm">
            Automatic sponsorship boosts your campaign funding by a percentage
          </p>
        </Card>

        <Card hover className="text-center">
          <div className="p-4 bg-secondary-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-secondary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Fair Distribution</h3>
          <p className="text-gray-600 text-sm">
            Distribute funds to multiple shareholders based on their stakes
          </p>
        </Card>

        <Card hover className="text-center">
          <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Secure & Transparent</h3>
          <p className="text-gray-600 text-sm">
            Smart contracts ensure security and complete transparency
          </p>
        </Card>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Buy Tokens</h3>
            <p className="text-gray-600">
              Purchase FUND tokens with ETH at a fixed price to participate in campaigns
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Contribute or Create</h3>
            <p className="text-gray-600">
              Contribute to existing campaigns or create your own with custom goals
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Receive & Distribute</h3>
            <p className="text-gray-600">
              Get sponsorship, reach your goal, and distribute funds to shareholders
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      {!isConnected && (
        <Card className="text-center py-12 gradient-bg text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-6 opacity-90">
            Connect your wallet to start participating in crowdfunding campaigns
          </p>
          <Button variant="secondary" size="lg">
            Connect Wallet
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Home;

