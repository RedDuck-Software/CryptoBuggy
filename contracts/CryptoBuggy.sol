// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./NFT.sol";
import "./BuggyToken.sol";

contract CryptoBuggy{
   uint256 public price;
   NFT public nft;
   BuggyToken public buggyToken;
   constructor(uint256 _price, address _nft, address _buggyToken){
      price = _price;
      nft = NFT(_nft);
      buggyToken = BuggyToken(_buggyToken);
   }
   function addFund(string memory _signature) public payable{
        require(msg.value == price, "Not enough funds to create the NFT");
        nft.mintToken(msg.sender, _signature);
        buggyToken.mintToken(msg.sender, price);
   }
}