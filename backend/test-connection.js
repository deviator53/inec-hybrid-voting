import { ethers } from "ethers";
import fs from "fs";

async function testConnection() {
  try {
    console.log("🔍 Testing blockchain connection...\n");

    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      provider
    );

    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Blockchain connected - Block:", blockNumber);

    const deployment = JSON.parse(
      fs.readFileSync("./blockchain/deployment.json", "utf8")
    );
    const artifact = JSON.parse(
      fs.readFileSync(
        "./blockchain/artifacts/contracts/ElectorateVoting.sol/ElectorateVoting.json",
        "utf8"
      )
    );

    const contract = new ethers.Contract(
      deployment.address,
      artifact.abi,
      wallet
    );

    const isActive = await contract.electionActive();
    const totalVotes = await contract.totalVotes();
    const candidateCount = await contract.candidateCount();

    console.log("\n📊 Election Status:");
    console.log(`   Active: ${isActive ? "YES ✅" : "NO ❌"}`);
    console.log(`   Total Votes: ${totalVotes.toString()}`);
    console.log(`   Candidates: ${candidateCount.toString()}`);

    const [names, parties, votes] = await contract.getResults();
    console.log("\n📋 Current Results:");
    for (let i = 0; i < names.length; i++) {
      console.log(`   ${i + 1}. ${names[i]} (${parties[i]}) - ${votes[i]} votes`);
    }

    if (!isActive) {
      console.log("\n⚠️  Election is not active. Add candidates first, then activate.");
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.message.includes("could not detect network") || error.code === "NETWORK_ERROR") {
      console.log("\n⚠️  Blockchain is NOT running!");
      console.log("Start it with: npx hardhat node");
    }
  }
}

testConnection();
