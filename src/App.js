import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { getPaymasterParams, Web3ZKsyncL2, ZKsyncPlugin, types } from 'web3-plugin-zksync';
import { APPROVAL_TOKEN, PAYMASTER } from './constants';
import { Box, Button, Card, CardContent, Typography, CircularProgress, TextField } from '@mui/material';
import './App.css';
// import ERC20ABI from './abis/ERC20ABI.json';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [balances, setBalances] = useState({
    paymasterEth: '0',
    paymasterApprovalToken: '0',
    senderEth: '0',
    // senderApprovalToken: '0',
    // receiverApprovalToken: '0',
  });
  const [transactionHash, setTransactionHash] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [zkSyncWallet, setZkSyncWallet] = useState(null);

  useEffect(() => {
    if (walletConnected) {
      fetchBalances();
      initializeZkSyncWallet();
    }
  }, [walletConnected]);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setWalletConnected(true);
        console.log('Wallet connected');
      } else {
        alert('MetaMask is required to connect your wallet');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const initializeZkSyncWallet = async () => {
    try {
      const l2 = Web3ZKsyncL2.initWithDefaultProvider(types.Network.Sepolia);
      const zkSyncWeb3 = new Web3(window.ethereum);
      zkSyncWeb3.registerPlugin(new ZKsyncPlugin(l2));
      
      const wallet = {
        address: account,
        l2,
        web3: zkSyncWeb3,
        getAllowance: async (token, owner, spender) => {
          const tokenContract = new zkSyncWeb3.eth.Contract([
            {
              constant: true,
              inputs: [{ name: "_owner", type: "address" }, { name: "_spender", type: "address" }],
              name: "allowance",
              outputs: [{ name: "", type: "uint256" }],
              type: "function"
            }
          ], token);
          return tokenContract.methods.allowance(owner, spender).call();
        },
        approveToken: async (token, spender, amount) => {
          const tokenContract = new zkSyncWeb3.eth.Contract([
            {
              constant: false,
              inputs: [{ name: "_spender", type: "address" }, { name: "_value", type: "uint256" }],
              name: "approve",
              outputs: [{ name: "", type: "bool" }],
              type: "function"
            }
          ], token);
          return tokenContract.methods.approve(spender, amount).send({ from: account });
        },
        transfer: async (params) => {
          // This is a basic implementation and may need to be adjusted based on zkSync specifics
          return zkSyncWeb3.eth.sendTransaction({
            from: account,
            to: params.to,
            value: params.amount,
            // You might need to add more parameters here for zkSync-specific functionality
          });
        },
      };

      setZkSyncWallet(wallet);
      console.log('zkSync wallet initialized:', wallet);
    } catch (error) {
      console.error('Error initializing zkSync wallet:', error);
    }
  };

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const l2 = Web3ZKsyncL2.initWithDefaultProvider(types.Network.Sepolia);
      const zkSyncWeb3 = new Web3(window.ethereum);
      zkSyncWeb3.registerPlugin(new ZKsyncPlugin(l2));

      const paymasterEthBalance = await zkSyncWeb3.eth.getBalance(PAYMASTER);
      const senderEthBalance = await zkSyncWeb3.eth.getBalance(account);

      // Use the l2 provider directly for token balances
      const paymasterTokenBalance = await l2.getTokenBalance(APPROVAL_TOKEN, PAYMASTER);
      const senderTokenBalance = await l2.getTokenBalance(APPROVAL_TOKEN, account);

      setBalances({
        paymasterEth: Web3.utils.fromWei(paymasterEthBalance, 'ether'),
        paymasterApprovalToken: Web3.utils.fromWei(paymasterTokenBalance.toString(), 'ether'),
        senderEth: Web3.utils.fromWei(senderEthBalance, 'ether'),
        senderApprovalToken: Web3.utils.fromWei(senderTokenBalance.toString(), 'ether'),
        receiverApprovalToken: '0',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching balances:', error);
      setLoading(false);
    }
  };

  const handleSendMoney = async () => {
    try {
      setLoading(true);
      if (!zkSyncWallet) {
        throw new Error('zkSync wallet not initialized');
      }
  
      const amountInWei = Web3.utils.toWei(amount, 'ether');
  
      console.log('Initiating transfer...');
      console.log('From:', account);
      console.log('To:', recipient);
      console.log('Amount:', amount, 'ETH');
  
      // Check if the token is approved for the paymaster
      const allowance = await zkSyncWallet.getAllowance(APPROVAL_TOKEN, account, PAYMASTER);
      if (Web3.utils.toBN(allowance).lt(Web3.utils.toBN(amountInWei))) {
        console.log('Approving token for paymaster...');
        const approveTx = await zkSyncWallet.approveToken(APPROVAL_TOKEN, PAYMASTER, amountInWei);
        console.log('Approval transaction:', approveTx);
        console.log('Token approved');
      }
  
      // Transfer tokens
      const transferTx = await zkSyncWallet.transfer({
        to: recipient,
        amount: amountInWei,
        gas: 6000000,
      });
  
      console.log('Transaction submitted:', transferTx.transactionHash);
      setTransactionHash(transferTx.transactionHash);
  
      // Wait for the transaction to be mined
      const receipt = await zkSyncWallet.web3.eth.getTransactionReceipt(transferTx.transactionHash);
      console.log('Transaction confirmed:', receipt);
  
      await fetchBalances(); // Refresh balances after successful transaction
      setLoading(false);
    } catch (error) {
      console.error('Error sending money:', error);
      setLoading(false);
    }
  };
  
  
  return (
    <div className="background">
      <Box className="app">
        {!walletConnected ? (
          <Button
            variant="contained"
            className="connect-btn"
            onClick={connectWallet}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} className="progress" /> : 'Connect Wallet'}
          </Button>
        ) : (
          <>
            <Typography variant="h4" className="title">
              FlowPay - Gasless Payments on zkSync
            </Typography>
            <Box className="cards">
              <Card className="card">
                <CardContent>
                  <Typography color="textSecondary">Paymaster ETH</Typography>
                  <Typography variant="h5">{balances.paymasterEth}</Typography>
                </CardContent>
              </Card>
              <Card className="card">
                <CardContent>
                  <Typography color="textSecondary">Paymaster Approval Token</Typography>
                  <Typography variant="h5">{balances.paymasterApprovalToken}</Typography>
                </CardContent>
              </Card>
              <Card className="card">
                <CardContent>
                  <Typography color="textSecondary">Sender ETH</Typography>
                  <Typography variant="h5">{balances.senderEth}</Typography>
                </CardContent>
              </Card>
              <Card className="card">
                <CardContent>
                  <Typography color="textSecondary">Sender Approval Token</Typography>
                  <Typography variant="h5">{balances.senderApprovalToken}</Typography>
                </CardContent>
              </Card>
              <Card className="card">
                <CardContent>
                  <Typography color="textSecondary">Receiver Approval Token</Typography>
                  <Typography variant="h5">{balances.receiverApprovalToken}</Typography>
                </CardContent>
              </Card>
            </Box>

            <Box className="transfer-section">
              <TextField
                label="Recipient Address"
                variant="outlined"
                fullWidth
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="input-field"
              />
              <TextField
                label="Amount (ETH)"
                variant="outlined"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
                type="number"
              />
              <Button
                variant="contained"
                className="send-btn"
                onClick={handleSendMoney}
                disabled={loading || !recipient || !amount}
              >
                {loading ? <CircularProgress size={24} className="progress" /> : 'Send Money'}
              </Button>
            </Box>

            {transactionHash && (
              <Typography variant="h6" className="transaction">
                Transaction Hash: {transactionHash}
              </Typography>
            )}
          </>
        )}
      </Box>
    </div>
  );
};

export default App;