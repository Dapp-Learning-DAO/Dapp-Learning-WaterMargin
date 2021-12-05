// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require('hardhat');

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

function hashToken(account) {
  return Buffer.from(ethers.utils.solidityKeccak256(['address'], [account]).slice(2), 'hex')
}


async function main() {

  const [deployer] = await ethers.getSigners();

  console.log(deployer.address);

  const artifactAuction = artifacts.readArtifactSync("AuctionFixedPrice");

  let auction = new ethers.Contract( "0x9089F4F3a19bdF13816e7c940d9376De32CFE2Fd" , artifactAuction.abi , deployer );

  // Get auction info
  let [seller,price,duration,tokenAddress,isActive] = await auction.getTokenAuctionDetails("0x4a4093dae325a87c18d26e7ccd5c123b63063b6a",2);
  console.log(seller,price.toString(),duration.toString(),tokenAddress,isActive);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
