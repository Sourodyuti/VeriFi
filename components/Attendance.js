import { useState } from 'react';
import web3 from '../utils/web3';
import VeriFiAttendanceABI from '../utils/VeriFiAttendanceABI.json';
import { verifiAttendanceAddress } from '../utils/contractAddresses';

const verifiAttendanceContract = new web3.eth.Contract(VeriFiAttendanceABI, verifiAttendanceAddress);

export default function Attendance({ account }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to mark attendance
  const markAttendance = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setMarkingAttendance(true);
      setError('');
      setSuccess('');

      // Call the smart contract to mark attendance
      await verifiAttendanceContract.methods.markAttendance(true).send({ from: account });

      setSuccess('Attendance marked successfully!');
      setTimeout(() => setSuccess(''), 3000);

      // Refresh records after marking attendance
      fetchRecords();
    } catch (err) {
      setError(`Failed to mark attendance: ${err.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setMarkingAttendance(false);
    }
  };

  // Function to fetch attendance records
  const fetchRecords = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const records = [];
      let index = 0;

      // Loop to fetch records dynamically
      while (true) {
        try {
          // Fetch the record at the current index
          const record = await verifiAttendanceContract.methods.records(account, index).call();
          records.push({
            timestamp: record.timestamp,
            present: record.present,
          });
          index++; // Move to the next index
        } catch (err) {
          // Break the loop if an error occurs (no more records)
          break;
        }
      }

      setRecords(records);
    } catch (err) {
      setError(`Failed to fetch records: ${err.message}`);
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Function to format timestamp into a readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(Number(timestamp) * 1000); // Convert to milliseconds
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: '8px', verticalAlign: 'middle' }}
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
              fill="#3498db"
            />
          </svg>
          Attendance
        </h2>
      </div>

      {/* Error and Success Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="btn-primary"
          onClick={markAttendance}
          disabled={markingAttendance || !account}
        >
          {markingAttendance ? (
            <>
              Marking...
              <span className="loading"></span>
            </>
          ) : (
            'Mark Present'
          )}
        </button>

        <button
          className="btn-secondary"
          onClick={fetchRecords}
          disabled={loading || !account}
        >
          {loading ? (
            <>
              Loading...
              <span className="loading"></span>
            </>
          ) : (
            'View Records'
          )}
        </button>
      </div>

      {/* Attendance Records */}
      {records.length > 0 ? (
        <div className="records-container">
          <h3>Attendance Records</h3>
          <ul className="records-list">
            {records.map((record, index) => (
              <li key={index} className={record.present ? 'present' : 'absent'}>
                <div className="record-info">
                  <span className={`badge ${record.present ? 'success' : 'warning'}`}>
                    {record.present ? 'Present' : 'Absent'}
                  </span>
                  <span className="record-date">{formatDate(record.timestamp)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : loading ? (
        <div className="loading-container">
          <span className="loading"></span>
        </div>
      ) : records.length === 0 && account ? (
        <div className="empty-state">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"
              fill="currentColor"
            />
            <path
              d="M12 12C13.65 12 15 10.65 15 9C15 7.35 13.65 6 12 6C10.35 6 9 7.35 9 9C9 10.65 10.35 12 12 12ZM12 8C12.55 8 13 8.45 13 9C13 9.55 12.55 10 12 10C11.45 10 11 9.55 11 9C11 8.45 11.45 8 12 8Z"
              fill="currentColor"
            />
            <path
              d="M6 16.47C6 14.6 9.97 13.75 12 13.75C14.03 13.75 18 14.6 18 16.47V17H6V16.47ZM8.31 15H15.69C15 14.44 13.31 14 12 14C10.69 14 9 14.44 8.31 15Z"
              fill="currentColor"
            />
          </svg>
          <p>No attendance records found</p>
          <button
            className="btn-sm"
            onClick={markAttendance}
            disabled={markingAttendance}
          >
            Mark Your First Attendance
          </button>
        </div>
      ) : null}

      {/* Wallet Not Connected Prompt */}
      {!account && (
        <div className="connect-prompt">
          <p>Connect your wallet to view and mark attendance</p>
        </div>
      )}
    </div>
  );
}