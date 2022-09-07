import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { CryptoBuggy, CryptoBuggy__factory, NFT, NFT__factory } from "../typechain-types";

describe("CryptoBuggy", function () {
    let deployer: SignerWithAddress;
    let user1 : SignerWithAddress;
    let cryptoBuggy : CryptoBuggy;
    let nft : NFT;
    beforeEach(async () => {
        [deployer, user1] = await ethers.getSigners();
        nft = await 
        (await new NFT__factory(deployer).deploy("1", "2")).deployed();
        cryptoBuggy = await (
           await new CryptoBuggy__factory(deployer).deploy(10, nft.address)
         ).deployed();
      });

    it("Should be possible to invest and get nft", async function () {
        await cryptoBuggy.connect(deployer).addFund("Tymur", {value: ethers.utils.parseEther('10')});
        expect(await nft.balanceOf(deployer.address)).to.be.eq(1);
        await cryptoBuggy.connect(deployer).addFund("Tymur", {value: ethers.utils.parseEther('10')});
        expect(await nft.balanceOf(deployer.address)).to.be.eq(2);
    });

    it("Should be impossible to invest with another value than price", async function () {
        await expect(cryptoBuggy.connect(deployer).addFund("Tymur", {value: ethers.utils.parseEther('11')})).to.be.
        revertedWith('Not enough funds to create the NFT');        
        expect(await nft.balanceOf(deployer.address)).to.be.eq(0);
    });
});
