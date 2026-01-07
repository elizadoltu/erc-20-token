import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';
import { Wallet, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    onMenuToggle?.();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">CrowdFund</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/tokens" className="text-gray-700 hover:text-primary-600 transition-colors">
              Tokens
            </Link>
            <Link to="/campaigns" className="text-gray-700 hover:text-primary-600 transition-colors">
              Campaigns
            </Link>
            <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
              Admin
            </Link>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <ConnectButton />
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-slide-down">
          <nav className="flex flex-col space-y-2 px-4 py-4">
            <Link
              to="/"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/tokens"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tokens
            </Link>
            <Link
              to="/campaigns"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Campaigns
            </Link>
            <Link
              to="/admin"
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
            <div className="pt-2 sm:hidden">
              <ConnectButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

