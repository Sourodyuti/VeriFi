import { useState, useEffect } from 'react';
import web3 from '../utils/web3';
import VeriFiTokenABI from '../utils/VeriFiTokenABI.json';
import { verifiTokenAddress } from '../utils/contractAddresses';

const verifiTokenContract = new web3.eth.Contract(VeriFiTokenABI, verifiTokenAddress);

export default function Token({ account }) {
  const [balance, setBalance] = useState('0');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (account) {
      fetchBalance();
    }
  }, [account]);

  const fetchBalance = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const balance = await verifiTokenContract.methods.balanceOf(account).call();
      setBalance(web3.utils.fromWei(balance, 'ether'));
    } catch (err) {
      setError(`Failed to fetch balance: ${err.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const transferTokens = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!recipient || !web3.utils.isAddress(recipient)) {
      setError('Please enter a valid recipient address');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setTransferLoading(true);
      setError('');
      setSuccess('');
      
      const amountInWei = web3.utils.toWei(amount, 'ether');
      await verifiTokenContract.methods.transfer(recipient, amountInWei).send({ from: account });
      
      setSuccess(`Successfully transferred ${amount} VFI tokens to ${recipient.substring(0, 6)}...${recipient.substring(recipient.length - 4)}`);
      setTimeout(() => setSuccess(''), 3000);
      
      // Clear form and refresh balance
      setRecipient('');
      setAmount('');
      fetchBalance();
    } catch (err) {
      setError(`Transfer failed: ${err.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
            <path d="M12.89 11.1C11.11 10.51 10.25 9.89 10.25 8.93C10.25 7.82 11.28 7.01 12.9 7.01C14.5 7.01 15.23 7.79 15.34 8.93H17.71C17.57 7.09 16.36 5.47 14.06 4.97V2.61H11.75V4.93C9.5 5.32 7.81 6.73 7.81 8.95C7.81 11.58 9.86 12.91 12.1 13.61C14.1 14.25 14.65 15.14 14.65 16.08C14.65 16.76 14.19 17.82 12.9 17.82C11.5 17.82 10.66 16.96 10.5 15.83H8.13C8.3 17.96 9.88 19.39 11.75 19.77V22.13H14.06V19.8C16.32 19.45 18.09 18.13 18.09 16.06C18.09 12.83 15.66 11.93 12.89 11.1Z" fill="#3498db"/>
          </svg>
          VeriFi Tokens
        </h2>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="token-balance">
        <h3>Your Balance</h3>
        <div className="balance-display">
          {loading ? (
            <span className="loading"></span>
          ) : (
            <>
              <span className="balance-amount">{balance}</span>
              <span className="token-symbol">VFI</span>
            </>
          )}
        </div>
        <button 
          className="btn-sm btn-secondary"
          onClick={fetchBalance}
          disabled={loading || !account}
        >
          Refresh
        </button>
      </div>
      
      <div className="token-transfer">
        <h3>Transfer Tokens</h3>
        <div className="input-group">
          <label htmlFor="recipient">Recipient Address</label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            disabled={transferLoading || !account}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="token-amount">Amount</label>
          <input
            id="token-amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={transferLoading || !account}
          />
        </div>
        
        <button 
          className="btn-primary"
          onClick={transferTokens}
          disabled={transferLoading || !account || !recipient || !amount}
        >
          {transferLoading ? (
            <>
              Transferring...
              <span className="loading"></span>
            </>
          ) : (
            'Transfer Tokens'
          )}
        </button>
      </div>
      
      {!account && (
        <div className="connect-prompt">
          <p>Connect your wallet to view and transfer tokens</p>
        </div>
      )}
    </div>
  );
}