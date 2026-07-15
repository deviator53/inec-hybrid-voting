const { ethers } = require("ethers");
const fs = require("fs");

async function testConnection() {
  try {
    console.log("🔍 Testing blockchain connection...\n");

    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // Check connection
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Connected to blockchain");
    console.log(`📦 Current block number: ${blockNumber}\n`);

    // Load contract
    const deployment = JSON.parse(fs.readFileSync("blockchain/deployment.json", "utf8"));
    const artifact = JSON.parse(
      fs.readFileSync(
        "blockchain/artifacts/contracts/ElectorateVoting.sol/ElectorateVoting.json",
        "utf8"
      )
    );

    const contract = new ethers.Contract(deployment.address, artifact.abi, wallet);
    console.log("✅ Contract loaded:", deployment.address);

    // Check election status
    const isActive = await contract.electionActive();
    const totalVotes = await contract.totalVotes();
    const candidateCount = await contract.candidateCount();

    console.log("\n📊 Election Status:");
    console.log(`   Active: ${isActive ? "YES ✅" : "NO ❌"}`);
    console.log(`   Total Votes: ${totalVotes.toString()}`);
    console.log(`   Candidates: ${candidateCount.toString()}`);

    // Get results
    console.log("\n📋 Current Results:");
    const [names, parties, votes] = await contract.getResults();
    for (let i = 0; i < names.length; i++) {
      console.log(`   ${i + 1}. ${names[i]} (${parties[i]}) - ${votes[i]} votes`);
    }

    // Activate election if not active
    if (!isActive) {
      console.log("\n🔧 Activating election...");
      const tx = await contract.activateElection();
      await tx.wait();
      console.log("✅ Election activated!");
    }

    console.log("\n✅ All systems operational!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.message.includes("could not detect network")) {
      console.log("\n⚠️  Blockchain is not running. Please start it with:");
      console.log("   cd blockchain && npx hardhat node");
    }
  }
}

testConnection();
