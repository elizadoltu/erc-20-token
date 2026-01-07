import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { hardhat, sepolia } from 'wagmi/chains';

// Define Hardhat local chain
const hardhatLocal = {
  ...hardhat,
  id: Number(import.meta.env.VITE_CHAIN_ID) || 1337,
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_HARDHAT_RPC_URL || 'http://127.0.0.1:8545'],
    },
    public: {
      http: [import.meta.env.VITE_HARDHAT_RPC_URL || 'http://127.0.0.1:8545'],
    },
  },
};

export const config = getDefaultConfig({
  appName: 'Crowdfunding DAPP',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [
    hardhatLocal,
    ...(import.meta.env.VITE_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: false,
});

