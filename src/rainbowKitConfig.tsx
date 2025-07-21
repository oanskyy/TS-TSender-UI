'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';

import {
  anvil,
  zksync,
  mainnet,
  optimism,
  arbitrum,
  base,
  sepolia,
} from 'wagmi/chains';

export default getDefaultConfig({
  appName: 'TSender UI',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [anvil, zksync, mainnet, optimism, arbitrum, base, sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
