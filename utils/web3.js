import Web3 from 'web3';

let web3;

const getRpc = () => {
  // Use NEXT_PUBLIC_RPC_URL if provided (Next.js public env var)
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_RPC_URL) {
    return process.env.NEXT_PUBLIC_RPC_URL;
  }
  return 'https://rpc.open-campus-codex.gelato.digital';
};

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(getRpc());
  web3 = new Web3(provider);
}

export default web3;