import { getFullnodeUrl } from '@mysten/sui/client';

export const networkConfig = {
  devnet: { url: getFullnodeUrl('devnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') }
};

// You can change this to 'mainnet' or 'testnet' for production
export const NETWORK = 'testnet'; 