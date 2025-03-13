const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying your contract, please Wait...");
  const NFT = await ethers.deployContract("RncToken");

  await NFT.waitForDeployment();
  console.log("NFT Contract deployed to:", NFT.target);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });