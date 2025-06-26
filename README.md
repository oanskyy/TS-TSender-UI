# 🚀 TSender UI — Gas-Optimized ERC20 Airdrop Dashboard

A full-stack Web3 dashboard that replicates the functionality of [`t-sender.com`](https://t-sender.com), allowing admins to airdrop ERC20 tokens to multiple recipients via a highly gas-optimized smart contract (written in Huff). Built with modular Web3 hooks, secure wallet integration, and a responsive, user-focused interface.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

1. Create a react/next.js project (static)
2. Connect wallet 
  - configure wagmi, rainbowKit 
  - wrap app in providers 
  - add button UI
3. Implement this function

```javascript
   function airdropERC20(
        address tokenAddress, //ERC20 token to be airdroped
        address[] calldata recipients,
        uint256[] calldata amounts,
        uint256 totalAmount
        )
```

3. Deploy to Fleek

---

## 🛠 Tech Stack

- **Framework**: Next.js (React + TypeScript)
- **Web3 Libraries**: Wagmi · Viem · Ethers.js · RainbowKit
- **Styling**: Tailwind CSS
- **State/Logic**: Custom React hooks · Utility functions
- **Testing**: Anvil (Foundry) for local testnet
- **Deployment**: Fleek (IPFS-based static hosting)
- **Data Viz (optional)**: Recharts (for token distribution)
- **Performance**: Lighthouse reports
- **Linting & Formatting**: ESLint · Prettier

---

## 🔑 Core Features

- 🔐 Connect Wallet (MetaMask, WalletConnect via RainbowKit) 
- 🌐 Support for multiple chains: Mainnet, Optimism, Arbitrum, ZK Sync, Base, Sepolia, Anvil
- 📥 Input token address + recipient addresses + amounts (manually or via CSV or textarea)
- 🔎 Dynamic token data fetching (name, decimals)
- 📊 Live transaction preview (total in wei & formatted)
- ✅ Step-by-step transaction execution:
  - `approve` the token for TSender contract
  - `airdrop` to multiple recipients
- 🚨 Error handling for mismatched address/amounts and invalid formats
- 🧹 Clean, responsive, accessible UI built with Tailwind

&&

- 🧾 Input or Upload recipient addresses (CSV or textarea)
- 🪙 Airdrop ERC20 tokens in a batch (gas-optimized)
- 📊 Simulate transaction before sending
- 📦 Track transaction status (loading, success, error)
- 🔁 Reset state and safely handle form validation
- ✅ Handles invalid or duplicate addresses gracefully

---

## 🎯 Focus Areas

### 🧠 Web3 Integration

- Smart contract interaction via Wagmi & Viem
- Secure wallet connection and transaction signing
- Live contract reads (e.g., decimals, balances)
- Multi-chain support with network switching
- Optimized for minimal gas usage per batch
- Wallet connection flow with custom hooks

### 🎨 UI/UX Design

- Designed for clarity and speed in complex Web3 flows (Clear user flow from input to confirmation)
- Clean input validation, visual feedback, and loading states
- Modular components using Tailwind
- Transaction feedback via toasts and loaders
- Fully responsive layout, accessible design

### 🔐 Security & Gas Awareness

- UI supports safe usage of a gas-optimized Huff contract
- Shows token totals before signing to avoid mistakes
- Statically hosted frontend — no backend to compromise

### Frontend Code Quality

- Modular structure (hooks, components, utils)
- Linting, formatting, and reusable logic

---

## 📈 Planned Improvements

- [ ] 📊 Pie chart showing % token distribution (Recharts + Tailwind)
- [ ] 🧠 Address validation & ENS resolution support for recipient list
- [ ] 🗂 Save receipents address lists locally or to IPFS(localStorage or IPFS)
- [ ] 🔁 Batch pagination for >1,000 recipients (Add pagination or progress tracking for large lists)
- [ ] 🔎 Optimistic UI feedback before confirmation
- [ ] 🧠 Integrate The Graph for past airdrop history

---

## ⚡ Bonus Enhancements (TBD)

- 📊 **Charts / Token Breakdown**  
  Add Recharts pie chart showing how tokens are split per recipient or wallet group.

- 🎨 **UI Preview (PDF or Figma-style)**  
  Export UI screens as a PDF (like a Figma design handoff) to showcase clean visual structure.

- 🎥 **Loom Walkthrough**  
  Record a short (1–2 min) Loom video demoing:
  - Wallet connect → input → airdrop → confirmation

- 🚦 **Lighthouse Report**  
  Include a screenshot of Lighthouse scores for:
  - Performance
  - Accessibility
  - Best Practices
  - SEO

- 🔒 **Security checklist based on common Web3 pitfalls**

---

## 📂 Project Structure (Simplified)

/components → UI elements (buttons, form sections)
/hooks → Custom Web3 logic (e.g., useAirdrop)
/pages → Next.js routes (index, success, etc.)
/lib → Constants, utilities, config (RainbowKit)
/public → Assets
/docs → Detailed tech overview

---

## TO DO:

- Add a project walkthrough script
- Build the pie chart + token breakdown
- Design your PDF or Loom demo flow
