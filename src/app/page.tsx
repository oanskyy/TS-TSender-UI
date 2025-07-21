import AirdropForm from '../components/AirdropForm';

export default function Home() {
  // eslint-disable-next-line no-console
  console.log(
    'WalletConnect ID:',
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  );

  return (
    <div className="grid min-h-screen gap-12 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      {/* Main content */}
      <AirdropForm />
    </div>
  );
}
