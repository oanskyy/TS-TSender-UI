'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import dynamic from 'next/dynamic';
const WalletConnectDynamic = dynamic(() => import('./WalletConnect'), {
  ssr: false,
});
// It's not a hack—it’s the correct and recommended solution for scenarios like this
// “If a component crashes on the server because it assumes it's in the browser, I disable SSR for that component entirely using dynamic imports.”
// This pattern is used by Vercel themselves, in their docs and examples.
// With no SSR
// To dynamically load a component on the client side, you can use the ssr option to disable server-rendering. This is useful if an external dependency or component relies on browser APIs like window.
// ✅ Prevents SSR errors (indexedDB, window are undefined)
// ✅ Keeps server render fast and clean
// ✅ Defers heavy/browser-specific logic to client only
// ✅ Fully supported and documented by Vercel

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 h-20 backdrop-blur-sm bg-transparent overflow-hidden"
    >
      {/* Dot grid mask */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            key="dots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 pointer-events-none z-0
              bg-[radial-gradient(#000_0.5px,transparent_0.5px)]
              [background-size:6px_6px]
              mix-blend-multiply"
          />
        )}
      </AnimatePresence>

      {/* Bottom fade for smoother edge */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-white dark:to-black pointer-events-none z-10" />

      {/* Navigation content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <nav className="flex items-center space-x-6 text-md text-gray-800 dark:text-gray-200 font-medium">
          {/* Logo placeholder */}
          <span className="font-bold tracking-tight">TSender</span>
          {/* GitHub link */}
          <Link
            href="https://github.com/oanskyy/TS-TSender-UI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <FaGithub
              size={28}
              className=" hover:text-gray-500 hover:scale-110 transition-all"
            />
          </Link>

          {/* Internal links */}
          <Link href="/" className="hover:text-black dark:hover:text-white">
            Dashboard
          </Link>
          <Link
            href="/markets"
            className="hover:text-black dark:hover:text-white"
          >
            Markets
          </Link>
        </nav>

        <div className="flex-shrink-0">
          {/* <WalletConnect /> */}
          <WalletConnectDynamic />
        </div>
      </div>
    </motion.header>
  );
}
// This code defines a responsive header component with a logo, navigation links, and a wallet connection button.
// It uses Framer Motion for animations and Next.js Link for navigation.
// The header has a sticky position, a blurred background, and a dot grid mask that appears when scrolled.
// The header also includes a GitHub icon linking to the project's repository.
// The component is designed to be visually appealing and functional, providing a good user experience on both desktop and mobile devices.
