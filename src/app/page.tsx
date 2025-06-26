import WalletConnect from './components/WalletConnect';

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <WalletConnect />
      Hello from main page
    </div>
  );
}
