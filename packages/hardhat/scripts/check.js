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

  let dappCollectible = new ethers.Contract( "0x1ee4a4a61025831ffd741cdd1Ac5542b30FAa62E" , artifactCollectible.abi , deployer );

  let merkleTree = new MerkleTree(addressList.map(token => hashToken(token)), keccak256, { sortPairs: true });

  let proof = merkleTree.getHexProof(hashToken(deployer.address));

  let tx = await dappCollectible.mintItem(8,proof);
  await tx.wait();

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
