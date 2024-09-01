// src/BalanceCard.js
import React from 'react';
import './BalanceCard.css';

const BalanceCard = ({ balances }) => {
  return (
    <div className="balance-card">
      <h2>Balances</h2>
      <div className="balance-item">Paymaster ETH: {balances.paymasterETH}</div>
      <div className="balance-item">Paymaster ApprovalToken: {balances.paymasterApprovalToken}</div>
      <div className="balance-item">Sender ETH: {balances.senderETH}</div>
      <div className="balance-item">Sender ApprovalToken: {balances.senderApprovalToken}</div>
      <div className="balance-item">Receiver ApprovalToken: {balances.receiverApprovalToken}</div>
    </div>
  );
};

export default BalanceCard;
