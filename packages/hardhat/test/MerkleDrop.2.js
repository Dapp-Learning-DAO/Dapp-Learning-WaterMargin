const { ethers } = require('hardhat');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { expect } = require('chai');
const tokens = require('./tokens.json');


function hashToken(account) {
  return Buffer.from(ethers.utils.solidityKeccak256(['address'], [account]).slice(2), 'hex')
}

describe('ERC721MerkleDrop', function () {

  let merkleTree; 
  let accounts;
  let registry;
  let Alice;
  let Bob;
  before(async function() {
    [Alice,Bob] = await ethers.getSigners();
    console.log(Alice.address);
    console.log(Bob.address);
    //console.log(Object.entries(tokens));
    merkleTree = new MerkleTree(tokens.map(token => hashToken(token)), keccak256, { sortPairs: true });
    console.log("merkleTree Root:",merkleTree.getHexRoot()) 
  });

 describe('Mint all elements', function () {
    before(async function() {
      console.log("begin");
      let collectible = await ethers.getContractFactory("DappLearningCollectible");
      registry = await collectible.deploy();
      console.log("deploy");
      await registry.setRoot(merkleTree.getHexRoot());
      console.log("Finish setRoot");
    });

    it("Should deploy YourContract", async function () {
      let proof = merkleTree.getHexProof(hashToken(Alice.address));

      await registry.mintItem(8,proof);

      let registryBob = registry.connect(Bob);

      proof = merkleTree.getHexProof(hashToken(Bob.address));

      await registryBob.mintItem(8,proof);
    });
  }); 

  
});
