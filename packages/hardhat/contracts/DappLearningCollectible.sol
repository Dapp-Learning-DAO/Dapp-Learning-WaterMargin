pragma solidity 0.8.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract DappLearningCollectible is ERC721URIStorage{

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  //this lets you look up a token by the uri (assuming there is only one of each uri for now)
  mapping (uint256 => bool) public validRank;

  mapping (address => bool) public claimedBitMap;

  bytes32 private root;

  address private ADMIN;
  
  uint256 private RANKLENGTH = 108;

  uint256 public RANKCOUNTER;

  bool private MERKLEVALIDITY = true;

  bool private MINTLIMITED = true;
  constructor() public ERC721("Dapp-Learning", "DLDAO") {
    ADMIN = msg.sender;
  }


  modifier onlyAdmin() {
    require(ADMIN == msg.sender, 'only admin');
    _;
  }

  function setRoot(bytes32 _merkleroot ) public onlyAdmin {
    root = _merkleroot;
  }

  function setMerkleValidaity(bool _validity ) public onlyAdmin {
    MERKLEVALIDITY = _validity;
  }

  function setMintLimited(bool _limited ) public onlyAdmin {
    MINTLIMITED = _limited;
  }

  function mintItem(uint seed, bytes32[] memory proof) public returns (uint256)
  {
    if(MINTLIMITED){
      require(!claimedBitMap[msg.sender], 'Already Minted');
    }

    require(RANKCOUNTER <= 108, 'Distribution is over');
    if(MERKLEVALIDITY){
      require(MerkleProof.verify(proof, root, _leaf(msg.sender)), 'MerkleDistributor: Invalid proof.');
    }
    require(RANKCOUNTER <= 108, 'Distribution is over');

    _tokenIds.increment();

    uint256 id = _tokenIds.current();
    _mint(msg.sender, id);

    uint random = rand(seed) % RANKLENGTH;
    uint256 rank = getFreeRank(random);

    _setTokenURI(id, uint2str(rank));

    validRank[rank] = true;

    claimedBitMap[msg.sender] = true;

    RANKCOUNTER++;

    return id;
  }

  function uint2str(uint256 _i) public pure returns (string memory str) {
        if (_i == 0){
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0)
        {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0)
        {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
  }

  function rand(uint userSeed) public returns(uint){
    return uint(keccak256(
        abi.encodePacked(block.timestamp, block.number, userSeed, 
        blockhash(block.number))));
  }

  function _leaf(address account)
    internal pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(account));
    }

  function getFreeRank(uint256 randomNumber) internal view returns (uint256) {
      uint256 loopIndex = randomNumber;

      // 循环遍历，过滤已分配的 Rank 
      while (validRank[loopIndex]) {
        loopIndex = loopIndex +  1;

        if (loopIndex >= RANKLENGTH) {
          loopIndex = loopIndex % RANKLENGTH;
        }

      }
      
      return loopIndex;
  }

 

}