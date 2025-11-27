// Browser-side SHA-256 hashing utility
// Uses the Web Crypto Subtle API to compute the hash of a File or ArrayBuffer
export async function hashFile(file) {
  if (!file) throw new Error('No file provided');

  // Accept either a File/Blob or ArrayBuffer
  let arrayBuffer;
  if (file instanceof ArrayBuffer) {
    arrayBuffer = file;
  } else if (file.arrayBuffer) {
    arrayBuffer = await file.arrayBuffer();
  } else {
    throw new Error('Unsupported input type for hashing');
  }

  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default hashFile;
