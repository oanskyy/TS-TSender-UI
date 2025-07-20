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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---
## 🎯 Project Objective
 Build a front-end application to interact with the TSender smart contract. This contract facilitates airdropping ERC20 tokens to multiple recipients in a single transaction.

## 🔧 Build Steps
1. Create a react/next.js project (static)
2. Connect wallet

- feat: configure wagmi, rainbowKit
- feat: wrap app in providers
- feat: add connect wallet button UI
- style: add airdrop form with shadcn ui form, input, textarea

3. Implement this function

```javascript
   function airdropERC20(
        address tokenAddress, //ERC20 token to be airdroped
        address[] calldata recipients,
        uint256[] calldata amounts,
        uint256 totalAmount
        )
```

4. Deploy to Fleek

---

## ⚙️ Contract Addresses

| Contract        | Description                                               | Example Address                              |
| --------------- | --------------------------------------------------------- | -------------------------------------------- |
| **ERC20 Token** | The token you are airdropping. Must implement `approve`.  | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| **TSender**     | The airdrop smart contract that distributes tokens.       |
|                 | (Address that will be able to spend token on your behalf) | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |

✅ **ERC20 Token** is any deployable token contract (Huff or Solidity). (ETH)
✅ **TSender** is your airdrop smart contract that sends tokens in a batch.

---

✅ **How to check**

**To confirm ERC20 token contract:**

```bash
cast call <TOKEN_ADDRESS> "name()(string)"
cast call 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 "name()(string)"

```

**To confirm TSender/Airdrop contract:**

```bash
cast call <TSENDER_ADDRESS> "airdropERC20(address,address[],uint256[],uint256)()"
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "airdropERC20(address,address[],uint256[],uint256)()"

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
- **Testing**:
  - Unit tests with Jest
  - Planned E2E tests with Playwright

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
  - `approve` token spending for TSender(Airdrop)(Huff) smart contract
  - `airdrop` to multiple recipients
- 🚨 Handles mismatched address/amount inputs with clear errors
- 🧹 Clean, responsive, accessible UI built with Tailwind

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

---

### 🔒 Security Checklist (Common Web3 Pitfalls)

- [ ] ✅ **Input Sanitization**
  - [ ] Validate addresses (EIP-55 checksum)
  - [ ] Sanitize all form inputs
  - [ ] Handle malformed CSV uploads safely

- [ ] ✅ **Wallet Interaction Safety**
  - [ ] Use `preparedWriteContract` (wagmi)
  - [ ] Check for wallet connection before enabling form
  - [ ] Disable send button during TX

- [ ] ✅ **Smart Contract Precautions**
  - [ ] Check token allowance before `airdrop()`
  - [ ] Show gas estimate before confirmation
  - [ ] Graceful error messages on `revert`

- [ ] ✅ **Sensitive Data Handling**
  - [ ] Avoid logging wallet addresses or TX hashes unnecessarily
  - [ ] Don’t persist user data unless encrypted

- [ ] ✅ **Read-Only Queries**
  - [ ] Use `publicClient.readContract` for non-sensitive reads
  - [ ] Prefer event listeners / The Graph over polling

- [ ] ✅ **User Safety UX**
  - [ ] Warn on unsupported networks
  - [ ] Show token symbol, icon, and decimals clearly
  - [ ] Display connected chain/network name visibly

- [ ] ✅ **Deployment Hygiene**
  - [X] Store API keys in `.env.local`
  - [X] Never expose private keys or secrets client-side

---

### 🔁 Performance & Scaling

- [ ] Optimistic UI feedback (e.g. "Sending..." before confirmation)
- [ ] Progress tracker for large sends
- [ ] Pagination or batching for >1,000 recipients

### 🧠 Recipient Address Management

- [ ] ENS name resolution
- [ ] Address validation (checksum + format)
- [ ] Save recipient lists
  - [ ] Option 1: `localStorage`
  - [ ] Option 2: IPFS

---

### 📊 Analytics & Token Insights

- [ ] **Pie Chart (Recharts + Tailwind)**
  - [ ] Show % token distribution per recipient
  - [ ] Optional: Group wallets by category

---

### 📚 Airdrop History & Analytics

- [ ] Integrate **The Graph** for historical airdrop data
  - [ ] Display previous distributions
  - [ ] Link to transaction explorer (e.g. Etherscan)

---

### 🎥 Project Demo & Documentation

- [ ] Write walkthrough script
- [ ] Record Loom video (1–2 min)
  - [ ] Wallet connect
  - [ ] Input form
  - [ ] Submit → TX confirmation
- [ ] Design PDF or visual flow (Figma-style)

---

### 🚦 UX & Performance Audit

- [ ] Run Lighthouse Audit
  - [ ] Performance
  - [ ] Accessibility
  - [ ] Best Practices
  - [ ] SEO
- [ ] Include audit screenshot or score summary in docs

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
