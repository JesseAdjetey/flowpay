# FlowPay - Gasless Payments on zkSync

## Overview

FlowPay is a React-based web application that allows users to make gasless payments using zkSync on Ethereum Layer 2. This application connects to MetaMask, manages balances, and facilitates ETH transfers with reduced gas fees through zkSyn

## Key Features

- Wallet Connection: Connects to MetaMask for Ethereum transactions.
- zkSync Integration: Utilizes zkSync for gasless transactions on Layer 2.
- Balance Display: Shows ETH and token balances for the paymaster and sender.
- Gasless Transfers: Allows ETH transfers without high gas costs by using zkSync’s paymaster model.
- Real-Time Updates: Fetches and displays updated balances and transaction statuses

## Prerequisites

Before running the application, ensure you have the following:
- Node.js and npm installed on your local machine.
- MetaMask extension installed in your browser.
- An Ethereum wallet with funds in the Sepolia test network (or other zkSync-supported networks).


### zkSync (Paymaster)
- Handles payments and transactions within the system
- Ensures fast and low-cost transactions for users


## Deployment

TerraLedger is deployed and accessible on:

- Fleek: [https://terraledger.on.fleek.co](https://terraledger.on.fleek.co)
- Vercel: [https://terraledger.vercel.app](https://terraledger.vercel.app)

You can access and interact with the application through either of these links.

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-username/flowpay.git
   ```

2. Navigate to the Project Directory:
   ```
   cd flowpay

   ```

3. Install Dependencies
   ```
   npm install
   ```

4. Run the Application
   ```
   npm start
   ```

## Usage

1. Connect Wallet: Click the "Connect Wallet" button to connect your MetaMask wallet.

2.Check Balances: The application will display the ETH and token balances for the paymaster and sender once the wallet is connected.

3. Send Money:

- Enter the recipient’s address in the "Recipient Address" field.
- Enter the amount of ETH you want to send in the "Amount (ETH)" field.
- Click "Send Money" to initiate a gasless transaction using zkSync.
- View Transaction Status: The transaction hash will be displayed once the transaction is submitted.

## Key Components
- MetaMask Connection: Connects to the user's MetaMask wallet using Web3.js.
zkSync Wallet Initialization: Initializes a zkSync wallet to interact with Layer 2 solutions.
- Balances Fetching: Fetches ETH and token balances using zkSync’s provider.
- Gasless Transfers: Handles ETH transfers via zkSync with potential token approvals managed through zkSync’s API.

## Code Overview

### Main Functionalities
- connectWallet: Connects to MetaMask and fetches user accounts.
- initializeZkSyncWallet: Initializes the zkSync wallet for Layer 2 transactions.
- fetchBalances: Retrieves and displays ETH and token balances for the paymaster and sender.
- handleSendMoney: Facilitates the transfer of ETH using zkSync, ensuring tokens are approved for the paymaster if necessary.
  
### Libraries and Dependencies
- React: Frontend framework for building UI components.
- Web3.js: JavaScript library for interacting with the Ethereum blockchain.
- web3-plugin-zksync: Plugin for integrating zkSync functionality with Web3.js.
- Material-UI: UI components library for React.
- zkSync: Layer 2 scaling solution for Ethereum with reduced gas fees.
  
## Environment Variables
To run the application, ensure you have the correct values set in the constants file (constants.js):
- APPROVAL_TOKEN: The token contract address for approval.
- PAYMASTER: The paymaster contract address for zkSync transactions.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Troubleshooting

- Ensure MetaMask is installed and set to the correct network (e.g., Sepolia).
- Check console logs for errors during wallet connection or zkSync initialization.
- Verify that the token and paymaster addresses are correct in the constants.js file.

## Contact

@Serhaki
