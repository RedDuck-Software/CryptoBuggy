// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract NFT is ERC721, Ownable {
    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {

    }
    
    mapping(uint256 => string) public ownershipRecord;
    uint256 public tokenId;
    function mintToken(address sponsor, string memory signature) public {
        tokenId = tokenId + 1;
        ownershipRecord[tokenId] = signature;
        _safeMint(sponsor, tokenId);
    }
}