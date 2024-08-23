require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Ensure to load environment variables

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    nibiru: {
      url: "https://evm-rpc.testnet-1.nibiru.fi:443/", // Replace with the actual RPC URL
      accounts: { mnemonic: process.env.MNEMONIC } // Use mnemonic instead of private key
    },
  },
  paths: {
    artifacts: "./client/src/artifacts",
  },
};


