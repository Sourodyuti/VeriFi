import { useState } from 'react';
import web3 from '../utils/web3';
import VeriFiPaymentABI from '../utils/VeriFiPaymentABI.json';
import { verifiPaymentAddress } from '../utils/contractAddresses';

const verifiPaymentContract = new web3.eth.Contract(VeriFiPaymentABI, verifiPaymentAddress);

export default function Payment({ account }) {
  const [amount, setAmount] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const makePayment = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setPaymentLoading(true);
      setError('');
      setSuccess('');
      
      const amountInWei = web3.utils.toWei(amount, 'ether');
      await verifiPaymentContract.methods.makePayment().send({ 
        from: account, 
        value: amountInWei 
      });
      
      setSuccess(`Payment of ${amount} ETH successful!`);
      setTimeout(() => setSuccess(''), 3000);
      setAmount('');
      
      // Refresh payments after making a payment
      fetchPayments();
    } catch (err) {
      setError(`Payment failed: ${err.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setPaymentLoading(false);
    }
  };

  const fetchPayments = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const payments = await verifiPaymentContract.methods.getPayments(account).call();
      setPayments(Array.isArray(payments) ? payments : []);
    } catch (err) {
      setError(`Failed to fetch payments: ${err.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format ETH amount
  const formatAmount = (amountInWei) => {
    if (!amountInWei) return '0 ETH';
    return `${web3.utils.fromWei(amountInWei, 'ether')} ETH`;
  };

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.31 11.14C10.54 10.69 9.97 10.2 9.97 9.47C9.97 8.63 10.76 8.04 12.07 8.04C13.45 8.04 13.97 8.7 14.06 9.54H15.94C15.84 8.28 15.03 7.11 13.3 6.73V5H10.75V6.69C9.21 7.04 8 8.07 8 9.5C8 11.24 9.4 12.18 11.65 12.68C13.67 13.15 14.09 13.82 14.09 14.56C14.09 15.11 13.71 15.94 12.07 15.94C10.56 15.94 9.89 15.25 9.75 14.39H7.88C8.03 15.9 9.28 16.97 10.75 17.31V19H13.3V17.35C14.85 17.03 16.05 16.08 16.05 14.55C16.05 12.35 14.07 11.6 12.31 11.14Z" fill="#3498db"/>
          </svg>
          Payment
        </h2>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="payment-form">
        <div className="input-group">
          <label htmlFor="amount">Amount (ETH)</label>
          <input
            id="amount"
            type="number"
            step="0.001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter ETH amount"
            disabled={!account || paymentLoading}
          />
        </div>
        
        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={makePayment}
            disabled={paymentLoading || !account || !amount}
          >
            {paymentLoading ? (
              <>
                Processing...
                <span className="loading"></span>
              </>
            ) : (
              'Make Payment'
            )}
          </button>
          
          <button 
            className="btn-secondary"
            onClick={fetchPayments}
            disabled={loading || !account}
          >
            {loading ? (
              <>
                Loading...
                <span className="loading"></span>
              </>
            ) : (
              'View Payments'
            )}
          </button>
        </div>
      </div>
      
      {payments.length > 0 ? (
        <div className="records-container">
          <h3>Payment History</h3>
          <ul className="records-list">
            {payments.map((payment, index) => (
              <li key={index}>
                <div className="record-info">
                  <span className="badge">{formatAmount(payment.amount)}</span>
                  <span className="record-date">{formatDate(payment.timestamp)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : loading ? (
        <div className="loading-container">
          <span className="loading"></span>
        </div>
      ) : payments.length === 0 && account ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="currentColor"/>
          </svg>
          <p>No payment history found</p>
        </div>
      ) : null}
      
      {!account && (
        <div className="connect-prompt">
          <p>Connect your wallet to make payments</p>
        </div>
      )}
    </div>
  );
}