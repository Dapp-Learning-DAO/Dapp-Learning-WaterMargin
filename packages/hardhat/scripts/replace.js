/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const R = require("ramda");
require('dotenv').config();
var childprocess = require('child_process');
const { network } = require("hardhat");
var WETHConfig = require("./WETH.config");

const main = async () => {
  let WETHAddress = 'module.exports = "' + WETHConfig[network.name].WETH + '";';
  fs.writeFileSync(__dirname + '/../../react-app/src/contracts/WETH.address.js', WETHAddress);
  
  // Replace addressList.json'
  var addressList = fs.readFileSync(__dirname + '/addressList.json');
  fs.writeFileSync(__dirname + '/../../react-app/src/utils/addressList.json', addressList);

  let netwrokType = 'export const NETWROK_TYPE = "' + network.name + '";';
  fs.writeFileSync(__dirname + '/../../react-app/src/utils/networkType.js', netwrokType);

};



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
