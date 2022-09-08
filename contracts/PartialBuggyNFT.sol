// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PartialBuggyNFT is Ownable, ERC721URIStorage {
    address public minter;
    uint256 public tokenId;
    uint256 public createdNFT;
    mapping(uint256 => mapping(address => string)) public ownershipRecord;
    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {}

    function addPartialUser(uint256 _id, string memory signature, address _user) public{
      require(msg.sender == minter, "Only minter can add users");
      ownershipRecord[_id][_user] = signature;
    }

    function setImage(uint256 _id, string memory _nftURI) public onlyOwner {
        _setTokenURI(_id, _nftURI);
        createdNFT++;
    }

    function getImage(uint256 _id) public view returns (string memory) {
        return tokenURI(_id);
    }

    function setMinter(address _minter) public onlyOwner {
        minter = _minter;
    }

    function mintToken() public {
        require(msg.sender == minter, "Only minter can mint NFT");
        tokenId = tokenId + 1;
        _safeMint(owner(), tokenId);
    }
}
