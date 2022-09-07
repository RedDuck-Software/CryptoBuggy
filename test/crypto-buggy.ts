import { expect } from 'chai';
import { ethers } from 'hardhat';
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  BuggyToken,
  BuggyToken__factory,
  CryptoBuggy,
  CryptoBuggy__factory,
  BuggyNFT,
  BuggyNFT__factory,
} from '../typechain-types';

describe('CryptoBuggy', function () {
  let deployer: SignerWithAddress;
  let user1: SignerWithAddress;
  let cryptoBuggy: CryptoBuggy;
  let buggyToken: BuggyToken;
  let nft: BuggyNFT;
  let price = ethers.utils.parseEther('1.3');
  beforeEach(async () => {
    [deployer, user1] = await ethers.getSigners();
    nft = await (await new BuggyNFT__factory(deployer).deploy('1', '2')).deployed();
    buggyToken = await (
      await new BuggyToken__factory(deployer).deploy()
    ).deployed();
    cryptoBuggy = await (
      await new CryptoBuggy__factory(deployer).deploy(
        price,
        nft.address,
        buggyToken.address,
      )
    ).deployed();

    await nft.connect(deployer).setMinter(cryptoBuggy.address);
    await buggyToken.connect(deployer).setMinter(cryptoBuggy.address);
  });

  it('Should be possible to invest and get nft', async function () {
    await cryptoBuggy.connect(deployer).addFund('Tymur', 1, { value: price });
    expect(await nft.balanceOf(deployer.address)).to.be.eq(1);
    await cryptoBuggy.connect(deployer).addFund('Tymur', 1, { value: price });
    expect(await nft.balanceOf(deployer.address)).to.be.eq(2);
    expect(await buggyToken.balanceOf(deployer.address)).to.be.eq(price.mul(2));
  });

  it('Should be impossible to invest with another value than price', async function () {
    await expect(
      cryptoBuggy
        .connect(deployer)
        .addFund('Tymur', 1, { value: ethers.utils.parseEther('11') }),
    ).to.be.revertedWith('Not enough funds to create the NFT');
    expect(await nft.balanceOf(deployer.address)).to.be.eq(0);
  });

  it('Should be possible to invest and get nft with signature', async function () {
    await cryptoBuggy.connect(deployer).addFund('Tymur', 1, { value: price });
    expect(await nft.balanceOf(deployer.address)).to.be.eq(1);
    await cryptoBuggy.connect(deployer).addFund('RedDuck', 1, { value: price });
    expect(await nft.balanceOf(deployer.address)).to.be.eq(2);
    expect(await buggyToken.balanceOf(deployer.address)).to.be.eq(price.mul(2));
    expect((await nft.connect(deployer).ownershipRecord(1))).to.be.eq(
      'Tymur',
    );
    expect((await nft.connect(deployer).ownershipRecord(2))).to.be.eq(
      'RedDuck',
    );
  });

  it('Should be impossible to mint NFT outside CryptoBuggy.sol', async function () {
    await expect(
      nft.connect(deployer).mintToken(deployer.address, 'FakeNFT'),
    ).to.be.revertedWith('Only minter can mint NFT');
  });

  it('Should be impossible to mint BuggyToken (BGY) outside CryptoBuggy.sol', async function () {
    await expect(
      buggyToken
        .connect(deployer)
        .mintToken(deployer.address, ethers.utils.parseEther('10000')),
    ).to.be.revertedWith('Only minter can mint tokens');
  });

  it('Should be possible to set nftURI for deployer', async function () {
    const uri = 'some-uri';
    await cryptoBuggy.connect(deployer).addFund('Tymur', 1, { value: price });
    expect(await nft.balanceOf(deployer.address)).to.be.eq(1);
    await nft.connect(deployer).setImage(1, uri);
    expect((await nft.connect(deployer).ownershipRecord(1))).to.be.eq(
      "Tymur",
    );
    expect(await nft.connect(deployer).getImage(1)).to.be.eq(uri);
  });

  it('Should be possible to set nftURI for not deployer', async function () {
    const uri = 'some-uri';
    await cryptoBuggy.connect(deployer).addFund('Tymur', 1, { value: price });
    expect(await nft.balanceOf(deployer.address)).to.be.eq(1);
    await expect(nft.connect(user1).setImage(1, uri)).to.be.revertedWith(
      'Ownable: caller is not the owner',
    );
  });

  it('Should be possible to buy multiplie NFTs', async function () {
    const uri = "RedDuck.png";
    await cryptoBuggy
      .connect(deployer)
      .addFund('Tymur', 3, { value: price.mul(3) });
    expect(await nft.balanceOf(deployer.address)).to.be.eq(3);
    await nft.connect(deployer).setImage(1, uri);
    await nft.connect(deployer).setImage(2, uri);
    await nft.connect(deployer).setImage(3, uri);

    expect(await nft.connect(deployer).getImage(1)).to.be.eq(uri);
    expect(await nft.connect(deployer).getImage(2)).to.be.eq(uri);
    expect(await nft.connect(deployer).getImage(3)).to.be.eq(uri);

  });
});
