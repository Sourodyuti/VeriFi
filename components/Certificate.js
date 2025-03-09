import { useState, useEffect } from 'react';
import web3 from '../utils/web3';
import VeriFiCertificateABI from '../utils/VeriFiCertificateABI.json';
import { verifiCertificateAddress } from '../utils/contractAddresses';

const verifiCertificateContract = new web3.eth.Contract(VeriFiCertificateABI, verifiCertificateAddress);

export default function Certificate({ account }) {
  const [certificates, setCertificates] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [loading, setLoading] = useState(false);
  const [issuingCertificate, setIssuingCertificate] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    if (account) {
      fetchCertificates();
    }
  }, [account]);

  // Function to issue a certificate (mint an NFT)
  const issueCertificate = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!courseName.trim()) {
      setError('Please enter a course name');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setIssuingCertificate(true);
      setError('');
      setSuccess('');

      // Mint a new certificate (NFT)
      await verifiCertificateContract.methods.mint(account).send({ from: account });

      setSuccess(`Certificate for "${courseName}" issued successfully!`);
      setTimeout(() => setSuccess(''), 3000);

      // Clear form and refresh certificates
      setCourseName('');
      fetchCertificates();
    } catch (err) {
      setError(`Failed to issue certificate: ${err.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setIssuingCertificate(false);
    }
  };

  // Function to fetch certificates by iterating through token IDs
  const fetchCertificates = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const certificates = [];
      let tokenId = 0;

      // Loop through token IDs until an error occurs (no more tokens)
      while (true) {
        try {
          // Check if the current token is owned by the user
          const owner = await verifiCertificateContract.methods.ownerOf(tokenId).call();
          if (owner.toLowerCase() === account.toLowerCase()) {
            // Fetch metadata for the token
            const tokenURI = await verifiCertificateContract.methods.tokenURI(tokenId).call();
            const response = await fetch(tokenURI); // Fetch metadata from IPFS or other storage
            const metadata = await response.json();

            certificates.push({
              id: tokenId,
              courseName: metadata.name || 'Unnamed Course',
              timestamp: metadata.timestamp || Date.now(),
            });
          }
          tokenId++; // Move to the next token ID
        } catch (err) {
          // Break the loop if an error occurs (no more tokens)
          break;
        }
      }

      setCertificates(certificates);
    } catch (err) {
      setError(`Failed to fetch certificates: ${err.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(Number(timestamp) * 1000); // Convert to milliseconds
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // View certificate details
  const viewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
  };

  // Close certificate modal
  const closeCertificateModal = () => {
    setSelectedCertificate(null);
  };

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
            <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8.82 13.05L7.4 14.46L10.94 18L16.6 12.34L15.19 10.93L10.94 15.18L8.82 13.05Z" fill="#3498db"/>
          </svg>
          Certificates
        </h2>
      </div>

      {/* Error and Success Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Certificate Issuance Form */}
      <div className="certificate-form">
        <div className="input-group">
          <label htmlFor="course-name">Course Name</label>
          <input
            id="course-name"
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Enter course name"
            disabled={issuingCertificate || !account}
          />
        </div>

        <button
          className="btn-primary"
          onClick={issueCertificate}
          disabled={issuingCertificate || !account || !courseName.trim()}
        >
          {issuingCertificate ? (
            <>
              Issuing...
              <span className="loading"></span>
            </>
          ) : (
            'Issue Certificate'
          )}
        </button>
      </div>

      {/* Certificate List */}
      <div className="certificates-list">
        <div className="list-header">
          <h3>Your Certificates</h3>
          <button
            className="btn-sm btn-secondary"
            onClick={fetchCertificates}
            disabled={loading || !account}
          >
            {loading ? (
              <span className="loading"></span>
            ) : (
              'Refresh'
            )}
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <span className="loading"></span>
          </div>
        ) : certificates.length > 0 ? (
          <div className="certificates-grid">
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="certificate-card"
                onClick={() => viewCertificate(cert)}
              >
                <div className="certificate-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8.82 13.05L7.4 14.46L10.94 18L16.6 12.34L15.19 10.93L10.94 15.18L8.82 13.05Z" fill="#3498db"/>
                  </svg>
                </div>
                <div className="certificate-info">
                  <h4>{cert.courseName}</h4>
                  <p>Issued: {formatDate(cert.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : account ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
            </svg>
            <p>No certificates found</p>
            <p className="empty-state-subtitle">Issue your first certificate to get started</p>
          </div>
        ) : (
          <div className="connect-prompt">
            <p>Connect your wallet to view and issue certificates</p>
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className="certificate-modal-overlay" onClick={closeCertificateModal}>
          <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
            <div className="certificate-modal-header">
              <h3>Certificate of Completion</h3>
              <button className="close-button" onClick={closeCertificateModal}>×</button>
            </div>
            <div className="certificate-modal-content">
              <div className="certificate-template">
                <div className="certificate-logo">
                  <span className="logo-icon">✓</span> VeriFi
                </div>
                <h2>Certificate of Completion</h2>
                <p className="certificate-text">This certifies that</p>
                <p className="certificate-recipient">{account}</p>
                <p className="certificate-text">has successfully completed the course</p>
                <p className="certificate-course">{selectedCertificate.courseName}</p>
                <p className="certificate-date">Issued on {formatDate(selectedCertificate.timestamp)}</p>
                <div className="certificate-verification">
                  <p>Verified on Blockchain</p>
                  <p className="certificate-id">ID: {selectedCertificate.id}</p>
                </div>
              </div>
            </div>
            <div className="certificate-modal-footer">
              <button className="btn-primary" onClick={closeCertificateModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}