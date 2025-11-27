
# VeriFi

VeriFi is a Next.js + Ethereum dApp for on-chain verification of attendance, payments, tokens, and certificates. It provides a simple UI to interact with smart contracts (located in the `Contracts/` folder) and ships ABIs in `utils/` for frontend integration.

**This README covers:** quick setup, project layout, how to run the app locally, where to find smart contracts and ABIs, and helpful notes for contributors.

**Tech stack:** Next.js, React, Web3.js, Solidity

**Quick Links:**
- **Contracts:** `Contracts/`
- **Frontend pages:** `pages/`
- **React components:** `components/`
- **ABIs & utilities:** `utils/`

**Prerequisites**
- Node.js (v16+ recommended)
- npm (or yarn)
- MetaMask (or another Web3 wallet) for interacting with the dApp in the browser

**Install & Run (Development)**
Open PowerShell in the repository root and run:

```powershell
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser and connect your wallet via the UI.

**Available npm scripts**
- `npm run dev` — development server (Next.js)
- `npm run build` — build production assets
- `npm start` — start production server after build

**Project Structure (high level)**

- `Contracts/` : Solidity smart contracts
  - `Attendance.sol` — attendance-related contract
  - `Certificate.sol` — certificate management contract
  - `Payment.sol` — payment processing contract
  - `RewardToken.sol` — ERC-style token contract
- `components/` : React components used across pages (e.g., `Attendance.js`, `Certificate.js`, `Payment.js`, `Token.js`, `Navbar.js`)
- `pages/` : Next.js pages (`index.js`, `_app.js`, `_document.js`)
- `public/` & `styles/` : static assets and CSS
- `utils/` : ABIs, `web3.js`, `ContractAddresses.js`, and helper utilities

**Key files to inspect**
- `utils/web3.js` — web3 provider setup and fallback RPC. The file uses `window.ethereum` when available and falls back to a fixed RPC URL.
- `utils/VeriFi*.json` — ABI files for the deployed contracts (used by the frontend to create contract instances)
- `utils/ContractAddresses.js` — central place for contract addresses used by the frontend (update as you deploy)

**How the frontend connects**
- The UI requests wallet access using the browser provider (MetaMask). See `pages/index.js` which calls `web3.eth.getAccounts()` and passes the `account` prop down to components.

**Client-side hashing & privacy**
- The project implements client-side SHA-256 hashing to compute a file fingerprint without uploading the original file. See `utils/hash.js` for the hashing utility (uses the Web Crypto `SubtleCrypto` API).
- `components/Certificate.js` contains a file input that computes the SHA-256 digest when a file is selected and displays the hex hash. The app does not send the raw file to any server by default — only the hash can be recorded or used as metadata for on-chain anchoring.
- This approach preserves privacy: the original document remains on the user's device while a short, fixed-size fingerprint (the hash) can be anchored on-chain or included in off-chain metadata.

**Deployment & Contracts**
- This repository contains the Solidity contracts but does not include deployment scripts. For deployment use a tool like Hardhat or Truffle and add a `scripts/deploy.js` that records deployed addresses into `utils/ContractAddresses.js`.

**Developer Notes / Known Issues**
- `utils/web3.js` calls `window.ethereum.enable()` which is deprecated — consider updating to `ethereum.request({ method: 'eth_requestAccounts' })` for a cleaner API.
- Ensure the RPC endpoint in `utils/web3.js` is appropriate for your target network (mainnet/testnet/local). Currently it falls back to `https://rpc.open-campus-codex.gelato.digital`.
- `utils/hash.js` uses the browser `crypto.subtle` API; this runs only in secure contexts (HTTPS or localhost). When testing on a non-secure server, hashing may fail.
- The current certificate mint flow (`verifiCertificateContract.methods.mint(account)`) does not accept file hash or metadata directly. To record file hashes on-chain consider minting with a tokenURI that points to metadata (IPFS) which includes the computed hash.

**On-chain metadata & IPFS**
- This repository now supports minting certificates with a `tokenURI` that points to JSON metadata (IPFS). The flow implemented in `components/Certificate.js` is:
  1. User optionally selects a file — the UI computes a SHA-256 hash locally (`utils/hash.js`).
  2. If configured, the app uploads the file (optional) and metadata JSON to IPFS via Web3.Storage (`utils/ipfs.js`).
  3. The returned CID is used to create a `tokenURI` (gateway URL) which is passed to the smart contract when calling `mint(address, tokenURI)`.

**Configuration (Web3.Storage)**
- To enable IPFS uploads you must set a Web3.Storage API token as an environment variable in your Next.js environment:

- Create a `.env.local` file at the project root and add:

  ```text
  NEXT_PUBLIC_WEB3STORAGE_TOKEN=your_web3storage_api_token_here
  NEXT_PUBLIC_RPC_URL=https://... (optional)
  ```

- Get a token at https://web3.storage and paste it into `.env.local`.

**Hardhat deploy example**
- A minimal Hardhat configuration and deploy script have been added (`hardhat.config.js`, `scripts/deploy_certificate.js`). To deploy locally:

  ```powershell
  npm install
  npx hardhat node
  npm run deploy:certificate
  ```

  The script prints the deployed contract address. Update `utils/ContractAddresses.js` with the new address for the frontend.

**Notes about compatibility**
- The `Certificate` contract was updated to `ERC721URIStorage` and the `mint` function now accepts a `tokenURI` (`mint(address,string)`). If you already have the previous contract deployed, you'll need to redeploy and update the address in `utils/ContractAddresses.js`.

**Contributing**
- Please open issues for bugs and feature requests. Pull requests are welcome — keep changes small and focused.

**License**
- See the top-level `LICENSE` file for license terms.

---


