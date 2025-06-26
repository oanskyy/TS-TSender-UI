import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TSender UI — Gas-Optimized ERC20 Airdrop Dashboard',
  description:
    'A full-stack Web3 dashboard that replicates the functionality of t-sender.com, allowing admins to airdrop ERC20 tokens via a gas-optimized smart contract written in Huff.',
  keywords:
    'TSender, Web3, ERC20, airdrop, gas-optimized, Huff, smart contract, blockchain, wallet integration, responsive UI',
  authors: [{ name: 'oanskyy' }],
  themeColor: '#0070f3', // Choose your app’s primary color 💙
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
