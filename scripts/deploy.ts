import { task } from 'hardhat/config';

task('deploy-nft', 'We deploy nftf').setAction(async (_, { ethers }) => {
  const deployer = new ethers.Wallet('', ethers.provider);
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

  console.log('Buggy: ' + _buggy.address);
});
