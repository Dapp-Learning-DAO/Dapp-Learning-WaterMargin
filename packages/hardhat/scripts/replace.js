/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const addressList = require('./addressList.json');
var replace = require("replace");


const main = async () => {

  /* Replace WETH address with correct one
  *  rinkeyb: 0xc778417e063141139fce010982780140aa0cd5ab
  *  Matic: 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619
  */
  replace({
    regex: "0x46Dd6319e1CA8e889A13319CA0978B23A33CEd0E",
    replacement: "0xc778417e063141139fce010982780140aa0cd5ab",
    paths: [__dirname + '/../../react-app/src/contracts/WETH.address.js'],
    recursive: true,
    silent: true,
  });
  

};



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
