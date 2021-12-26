// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require('hardhat');

const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const addressList = require('./addressList.json');

function hashToken(account) {
  return Buffer.from(ethers.utils.solidityKeccak256(['address'], [account]).slice(2), 'hex')
}


async function main() {

  const [deployer] = await ethers.getSigners();

  console.log(deployer.address);

  const artifactCollectible = artifacts.readArtifactSync("DappLearningCollectible");

  let dappCollectible = new ethers.Contract( "0x2eb3F8280A658f7b36D4634b25225cd0B7e53904" , artifactCollectible.abi , deployer );

  // 设置 Merkle tree
  let rx = await dappCollectible.setMerkleValidaity(false);
  console.log(rx)
  await rx.wait();
  //let bitmap = await dappCollectible.claimedBitMap("0xD95Be34213b53e3eC51091a0c5De07641Fc1728e");
  //console.log("bitmap=====",bitmap)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
