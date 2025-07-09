# 🚀 TSender UI — Gas-Optimized ERC20 Airdrop Dashboard

[![Netlify Status](https://api.netlify.com/api/v1/badges/e057407b-7c49-45fe-9c0e-cd9eba70924d/deploy-status)](https://app.netlify.com/projects/token-airdrop-sender-202506/deploys)

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

- feat: configure wagmi, rainbowKit
- feat: wrap app in providers
- feat: add connect wallet button UI
- (style: add button in header)
- style: add airdrop form with shadcn ui form, input, textarea
- style: add split text motion animation

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

## ⚙️ Contract Addresses

| Contract        | Description                                               | Example Address                              |
| --------------- | --------------------------------------------------------- | -------------------------------------------- |
| **ERC20 Token** | The token you are airdropping. Must implement `approve`.  | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| **TSender**     | The airdrop contract that distributes tokens.             |
|                 | (Address that will be able to spend token on your behalf) | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |

✅ **ERC20 Token** is any deployable token contract (Huff or Solidity).  
✅ **TSender** is your airdrop smart contract that sends tokens in a batch.

---

✅ **How to check**

**To confirm ERC20 token contract:**

```bash
cast call <TOKEN_ADDRESS> "name()(string)"
cast call   "name()(string)"

```

\*\*To confirm TSender contract:

```bash
cast call <TSENDER_ADDRESS> "airdropERC20(address,address[],uint256[],uint256)()"
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "airdropERC20(address,address[],uint256[],uint256)()"

-----

(receipents anvil acc1): 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

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
- 🌐 Supports multiple chains: Mainnet, Optimism, Arbitrum, ZK Sync, Base, Sepolia, Anvil
- 📥 Inputs:
  - Token address
  - Recipient addresses
  - Amounts (textarea or CSV)
- 🔎 Dynamic token data fetching (name, decimals)
- 📊 Live transaction preview (total in wei & formatted)
- ✅ Step-by-step execution:
  - `approve` token spending for TSender contract
  - `airdrop` to multiple recipients
- 🚨 Handles mismatched address/amount inputs with clear errors
- 🧹 Clean, responsive, accessible UI built with Tailwind
- 🧪 **Testing**:
  - Unit tests with Jest
  - Planned E2E tests with Playwright

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
- [ ] Add a project walkthrough script
- Design your PDF or Loom demo flow

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
/hooks → Custom Web3 logic (approve, airdrop)
/pages → Next.js routes (index, success, etc.)
/lib → Constants, utilities, config (RainbowKit)
/public → Static assets
/docs → Detailed tech overview

---

### 🏁 **Deployment Note**

⚠️ **Anvil is local only. For production:**

- Deploy contracts to Sepolia or Mainnet
- Update Wagmi config with production RPC URLs
- Redeploy frontend to Netlify or Fleek

---

### 🙏 **Credits**

- Built by **[@oanskyy]**
- Inspired by [t-sender.com](https://t-sender.com) (gas optimization approach)

---
