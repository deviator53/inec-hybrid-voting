import { ethers } from "hardhat";

async function main() {
  console.log("🗳️  Deploying ElectorateVoting Contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const ElectorateVoting = await ethers.getContractFactory("ElectorateVoting");
  const voting = await ElectorateVoting.deploy(
    "GUBERNATORIAL_2026",
    "04/12/08/2001",
  );

  await voting.waitForDeployment();
  const address = await voting.getAddress();

  console.log("✅ ElectorateVoting deployed to:", address);
  console.log("⚠️  Election is NOT activated - add candidates first");

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    network: "hardhat-local",
  };

  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2),
  );

  console.log("💾 Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
