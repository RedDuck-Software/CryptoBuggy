// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable {
    address public minter;
    uint256 public tokenId;
    mapping(uint256 => Data) public ownershipRecord;
    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {

    }
    struct Data{
      string tokenURI;
      string signature;
    }
    function setImage(uint256 _id, string memory _nftURI) public onlyOwner{
      ownershipRecord[_id].tokenURI = _nftURI;
    }
   function setMinter(address _minter) public onlyOwner{
      minter = _minter;
    }
    function mintToken(address sponsor, string memory signature) public {
        require(msg.sender == minter, "Only minter can mint NFT");
        tokenId = tokenId + 1;
        ownershipRecord[tokenId].signature = signature;
        _safeMint(sponsor, tokenId);
    }
}