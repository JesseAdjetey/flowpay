// src/TransferCard.js
import React from 'react';
import './TransferCard.css';

const TransferCard = ({ onTransfer, loading, transactionHash }) => {
  return (
    <div className="transfer-card">
      <h2>Transfer Funds</h2>
      <button onClick={onTransfer} disabled={loading}>
        {loading ? 'Processing...' : 'Transfer'}
      </button>
      {transactionHash && <div className="transaction-hash">Transaction Hash: {transactionHash}</div>}
    </div>
  );
};

export default TransferCard;
