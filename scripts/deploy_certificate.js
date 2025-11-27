// Example Hardhat deploy script for Certificate contract
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  const Certificate = await ethers.getContractFactory('Certificate');
  const cert = await Certificate.deploy();
  await cert.deployed();

  console.log('Certificate deployed to:', cert.address);

  // Optionally, write the address to utils/ContractAddresses.js or print for manual update
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
