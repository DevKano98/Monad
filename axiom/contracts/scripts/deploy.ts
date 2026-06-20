import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const FingerprintRegistry = await ethers.getContractFactory("FingerprintRegistry");
  const fingerprintRegistry = await FingerprintRegistry.deploy(deployer.address);
  await fingerprintRegistry.waitForDeployment();

  const ReputationRegistry = await ethers.getContractFactory("ReputationRegistry");
  const reputationRegistry = await ReputationRegistry.deploy(deployer.address);
  await reputationRegistry.waitForDeployment();

  console.log("FingerprintRegistry:", await fingerprintRegistry.getAddress());
  console.log("ReputationRegistry:", await reputationRegistry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
