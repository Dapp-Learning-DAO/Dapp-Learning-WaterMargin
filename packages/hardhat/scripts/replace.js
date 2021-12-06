/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const R = require("ramda");
require('dotenv').config();
var childprocess = require('child_process');

const main = async () => {

  /* Replace WETH address with correct one
  *  rinkeyb: 0xc778417e063141139fce010982780140aa0cd5ab
  *  Matic: 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619
  */
  let WETHAddress = 'module.exports = "' + process.env.WETH_ADDRESS + '";';
  fs.writeFileSync(__dirname + '/../../react-app/src/contracts/WETH.address.js', WETHAddress);
  
  // Replace addressList.json'
  var addressList = fs.readFileSync(__dirname + '/addressList.json');
  fs.writeFileSync(__dirname + '/../../react-app/src/utils/addressList.json', addressList);

};



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
