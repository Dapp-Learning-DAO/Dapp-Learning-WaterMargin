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
  let registryBob;
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
      registry = await collectible.deploy("http://81.69.8.95/WaterMarginJson/");
      console.log("deploy");
      await registry.setRoot(merkleTree.getHexRoot());
      console.log("Finish setRoot");
    });

    it("Should deploy YourContract", async function () {
      let proof = merkleTree.getHexProof(hashToken(Alice.address));

      await registry.mintItem(8,proof);

      registryBob = registry.connect(Bob);

      proof = merkleTree.getHexProof(hashToken(Bob.address));

      await registryBob.mintItem(8,proof);
    });

    it("ADMIN has no limit to do mintItem", async function () {
      let proof = merkleTree.getHexProof(hashToken(Alice.address));

      await registry.mintItem(8,proof);
      await registry.mintItem(8,proof);
      let ownerAddress = await registry.ownerOf(3);
      expect(ownerAddress).to.equal(Alice.address);
      ownerAddress = await registry.ownerOf(4);
      expect(ownerAddress).to.equal(Alice.address);
    });

    it("User can't mint repeat", async function () {
      let proof = merkleTree.getHexProof(hashToken(Bob.address));
      await expect(registryBob.mintItem(8,proof)).to.be.revertedWith("Already Minted");
    });
  }); 

  
});
