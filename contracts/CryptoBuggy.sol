// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./NFT.sol";
contract CryptoBuggy{
   uint256 public price;
   NFT public nft;
   constructor(uint256 _price, address _nft){
      price = _price * 10 ** 18;
      nft = NFT(_nft);
   }
   function addFund(string memory _signature) public payable{
        require(msg.value == price, "Not enough funds to create the NFT");
        nft.mintToken(msg.sender, _signature);
   }
}