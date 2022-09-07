// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BuggyToken is ERC20, Ownable{
   address public minter;
    constructor() ERC20("Buggy", "BGY") {
        _mint(msg.sender, 0);
    }

   function setMinter(address _minter) public onlyOwner{
      minter = _minter;
    }

    function mintToken(address _sponsor, uint256 _amount) public{
      require(msg.sender == minter, "Only minter can mint tokens");
      _mint(_sponsor, _amount);
    }
}