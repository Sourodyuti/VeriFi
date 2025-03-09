import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Attendance from '../components/Attendance';
import Payment from '../components/Payment';
import Token from '../components/Token';
import Certificate from '../components/Certificate';
import web3 from '../utils/web3';
import Head from 'next/head';

export default function Home() {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const connectMetaMask = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } else {
        setError('MetaMask not detected! Please install MetaMask to use this application.');
      }
    } catch (err) {
      setError('Failed to connect: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
          
          // Listen for account changes
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0] || '');
          });
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    };
    
    checkConnection();
    
    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  return (
    <div className="app-container">
      <Head>
        <title>VeriFi - Blockchain Verification Platform</title>
        <meta name="description" content="Secure blockchain verification platform for attendance, payments, tokens, and certificates" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <Navbar account={account} connectMetaMask={connectMetaMask} />
      
      <main className="container">
        {/* Hero Section */}
        <section className="hero">
          <h1>Welcome to VeriFi</h1>
          <p className="hero-subtitle">
            Secure blockchain verification platform for attendance, payments, tokens, and certificates
          </p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {!account && (
            <div className="hero-cta">
              <button 
                className="cta-button" 
                onClick={connectMetaMask}
                disabled={loading}
              >
                {loading ? (
                  <>
                    Connecting...
                    <span className="loading"></span>
                  </>
                ) : (
                  'Connect with MetaMask'
                )}
              </button>
              <p className="cta-description">
                Connect your wallet to access all features
              </p>
            </div>
          )}
        </section>
        
        {/* Features Grid */}
        <section className="features">
          <div className="grid">
            <div className="card">
              <Attendance account={account} />
            </div>
            
            <div className="card">
              <Payment account={account} />
            </div>
            
            <div className="card">
              <Token account={account} />
            </div>
            
            <div className="card">
              <Certificate account={account} />
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} VeriFi. All rights reserved.</p>
          <p>Powered by Ethereum Blockchain</p>
        </footer>
      </main>
    </div>
  );
}