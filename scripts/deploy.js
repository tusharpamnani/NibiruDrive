const { ethers } = require("hardhat");

// Connect to the network
const jsonRpcProvider = new ethers.providers.JsonRpcProvider("https://evm-rpc.devnet-1.nibiru.fi:443");

// Mnemonic for the HD wallet
const mnemonic =
  "guard cream sadness conduct invite crumble clock pudding hole grit liar hotel maid produce squeeze return argue turtle know drive eight casino maze host";

// Derivation path
const path = "m/44'/118'/0'/0/0";
const wallet = ethers.Wallet.fromMnemonic(mnemonic, path).connect(jsonRpcProvider);

async function main() {
  console.log("Owner address:", wallet.address);

  // Print wallet balance before deployment
  const balanceBefore = await jsonRpcProvider.getBalance(wallet.address);
  console.log("Wallet balance before deployment:", ethers.utils.formatEther(balanceBefore));

  // Get the contract factory
  const Upload = await ethers.getContractFactory("Upload");

  // Deploy the contract
  console.log("Deploying contract...");
  const uploadContract = await Upload.deploy({
    gasPrice: ethers.utils.parseUnits("20", "gwei"), // Increase gas price if necessary
  });

  await uploadContract.deployed();

  console.log("Contract address:", uploadContract.address);

  // Print wallet balance after deployment
  const balanceAfter = await jsonRpcProvider.getBalance(wallet.address);
  console.log("Wallet balance after deployment:", ethers.utils.formatEther(balanceAfter));

  // Example interaction with the deployed contract
  // (Replace these lines with actual interactions if needed)
  // const result = await uploadContract.someFunction();
  // console.log("Result from contract function:", result);

  console.log("Contract deployed successfully!");
}

// Handle errors
main().catch((error) => {
  console.error("Error deploying contract:", error);
  process.exitCode = 1;
});
