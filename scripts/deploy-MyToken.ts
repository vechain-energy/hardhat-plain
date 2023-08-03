import { ethers } from "hardhat";

async function main() {
  // adjust "MyToken" to be your contracts name
  const NFT = await ethers.getContractFactory("MyToken");
  const nft = await NFT.deploy();
  await nft.deployed();

  console.log(`NFT deployed to ${nft.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })