import { BigNumber, BigNumberish } from 'ethers';
import { task } from 'hardhat/config';

task('deploy-nft', 'We deploy nftf').setAction(async (_, { ethers }) => {
  const deployer = new ethers.Wallet(
    'YOUR-ADDRESS',
    ethers.provider,
  );
  const nftFactory = await ethers.getContractFactory('BuggyNFT', deployer);
  let _nft = await (await nftFactory.deploy('BUGGY', 'BGY')).deployed();

  const buggyToken = await ethers.getContractFactory('BuggyToken', deployer);
  let _buggyToken = await (await buggyToken.deploy()).deployed();

  const buggyFactory = await ethers.getContractFactory('CryptoBuggy', deployer);
  let _buggy = await (
    await buggyFactory.deploy(
      ethers.utils.parseEther('0.001'),
      _nft.address,
      _buggyToken.address,
    )
  ).deployed();

  await _nft.connect(deployer).setMinter(_buggy.address);
  await _buggyToken.connect(deployer).setMinter(_buggy.address);

  console.log('NFT: ' + _nft.address);
  console.log('Buggy: ' + _buggy.address);
});

task('set-image-for-nft', 'We deploy nft').setAction(async (_, { ethers }) => {
  const deployer = new ethers.Wallet(
    'YOUR-ADDRESS',
    ethers.provider,
  );

  const buggy = await ethers.getContractAt(
    "CryptoBuggy",
    "BUGGY-ADDRESS",
    deployer,
  );

  const buggyNFT = await ethers.getContractAt(
    "BuggyNFT",
    "NFT-ADDRESS",
    deployer,
  );

  await buggy.connect(deployer).addFund("Tymur", 1, {value: ethers.utils.parseEther('0.001')});
  await buggyNFT.connect(deployer).setImage(1, "QmSMAt9PWkZCnhjqjvjCZTjRr72MmPhmwnAJ3pJA2epBws");
  console.log(await buggyNFT.connect(deployer).getImage(1));
});

//await buggy.connect(deployer).addFund("Tymur", 1, {value: ethers.utils.parseEther('0.001')});