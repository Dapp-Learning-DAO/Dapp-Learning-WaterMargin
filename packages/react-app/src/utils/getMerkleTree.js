import { MerkleTree } from "merkletreejs";
import { utils, constants } from "ethers";
import tokens from "./addressList.json";
import keccak256 from "keccak256";

export function hashToken(account) {
  return Buffer.from(utils.solidityKeccak256(['address'], [account]).slice(2), 'hex')
}

// utils.keccak256(tokens)
const merkleTree = new MerkleTree(tokens.map(token => hashToken(token)), keccak256, { sortPairs: true });

// console.log(merkleTree.getHexProof());

export default address => merkleTree.getHexProof(hashToken(address))
