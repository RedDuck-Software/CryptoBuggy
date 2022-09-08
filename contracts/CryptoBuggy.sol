// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./BuggyNFT.sol";
import "./BuggyToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoBuggy is Ownable {
    uint256 public price;
    mapping(address => uint256) public users;
    uint256 public uniqUsers;
    uint256 public boughtBuggy;
    BuggyNFT public buggyNFT;
    BuggyToken public buggyToken;

    constructor(
        uint256 _price,
        address _nft,
        address _buggyToken
    ) {
        price = _price;
        buggyNFT = BuggyNFT(_nft);
        buggyToken = BuggyToken(_buggyToken);
    }

    function addFund(string memory _signature, uint256 count) public payable {
        uint256 expectedValue = price * count;
        require(
            msg.value == expectedValue,
            "Not enough funds to create the NFT"
        );
        if (count == 1) {
            buggyNFT.mintToken(msg.sender, _signature);
        } else {
            for (uint256 i = 0; i < count; i++) {
                buggyNFT.mintToken(msg.sender, _signature);
            }
        }
        boughtBuggy += count;
        if(users[msg.sender] == 0){
            uniqUsers++;
        }
        users[msg.sender] += count;
        buggyToken.mintToken(msg.sender, expectedValue);
    }

    function withdraw(address _beneficiary) public onlyOwner {
        payable(_beneficiary).transfer(address(this).balance);
    }
}
