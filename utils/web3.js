import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // Use MetaMask's provider
  web3 = new Web3(window.ethereum);
  window.ethereum.enable(); // Request account access
} else {
  // Fallback to a local provider (e.g., for testing)
  const provider = new Web3.providers.HttpProvider('https://rpc.open-campus-codex.gelato.digital');
  web3 = new Web3(provider);
}

export default web3;