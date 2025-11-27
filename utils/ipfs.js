// Minimal IPFS metadata uploader using Web3.Storage
// Requires NEXT_PUBLIC_WEB3STORAGE_TOKEN to be set in environment
import { Web3Storage } from 'web3.storage';

function getClient() {
  const token = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
  if (!token) return null;
  return new Web3Storage({ token });
}

export async function uploadJSON(metadata) {
  const client = getClient();
  if (!client) throw new Error('Missing NEXT_PUBLIC_WEB3STORAGE_TOKEN');

  const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
  const files = [new File([blob], 'metadata.json')];
  const cid = await client.put(files, { wrapWithDirectory: false });
  return cid; // CID string
}

export async function uploadFile(file) {
  const client = getClient();
  if (!client) throw new Error('Missing NEXT_PUBLIC_WEB3STORAGE_TOKEN');
  const files = [file];
  const cid = await client.put(files, { wrapWithDirectory: false });
  return cid;
}

export default { uploadJSON, uploadFile };
