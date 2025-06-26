import { ConnectButton } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const WalletConnect = () => {
  return (
    <div>
      <h2>Connect Your Wallet</h2>
      <ConnectButton />
    </div>
  );
};

export default WalletConnect;
// This component provides a simple interface for users to connect their wallets using RainbowKit's ConnectButton.
// It can be used in any part of your application where wallet connection is required.
// Make sure to import and use this component in your main layout or specific pages where wallet interaction is needed.
// You can customize the appearance and behavior of the ConnectButton through RainbowKit's configuration options.
