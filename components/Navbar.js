import { useState, useEffect } from 'react';

export default function Navbar({ account, connectMetaMask }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll event to add scrolled class
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Format account address for display
  const formatAccount = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="logo">
        <h2 className="navbar-brand">
          <span className="logo-icon">✓</span> VeriFi
        </h2>
        <p className="tagline">Blockchain Verification Platform</p>
      </div>
      
      <div className="nav-actions">
        {account ? (
          <div className="account-dropdown">
            <button 
              className="account-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="account-indicator"></span>
              <span>{formatAccount(account)}</span>
              <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
            </button>
            
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <strong>Full Address:</strong>
                  <p className="full-address">{account}</p>
                </div>
                <div className="dropdown-item">
                  <a 
                    href={`https://etherscan.io/address/${account}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View on Etherscan
                  </a>
                </div>
                <div className="dropdown-item">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(account);
                      alert('Address copied to clipboard!');
                    }}
                  >
                    Copy Address
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button 
            className="connect-button" 
            onClick={connectMetaMask}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
              <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="currentColor" />
            </svg>
            Connect MetaMask
          </button>
        )}
      </div>
    </nav>
  );
}