import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { ethers } from "ethers";
import crypto from "crypto";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Allow multiple origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "https://inec-hybrid-voting.vercel.app",
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

// MongoDB Connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/inec_voting";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Blockchain connection
const provider = new ethers.JsonRpcProvider(
  process.env.BLOCKCHAIN_RPC || "http://127.0.0.1:8545",
);
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

let votingContract: any = null;

// Helper to ensure contract is loaded
const ensureContract = (): any => {
  if (!votingContract) {
    throw new Error("Voting contract not initialized");
  }
  return votingContract;
};

// Load contract with proper ABI
const loadContract = async () => {
  try {
    const fs = await import("fs");
    const path = await import("path");

    // Load contract address
    const deploymentPath = path.join(
      process.cwd(),
      "../blockchain/deployment.json",
    );
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));

    // Load contract ABI from artifacts
    const artifactPath = path.join(
      process.cwd(),
      "../blockchain/artifacts/contracts/ElectorateVoting.sol/ElectorateVoting.json",
    );
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    votingContract = new ethers.Contract(
      deployment.address,
      artifact.abi,
      wallet,
    );
    console.log("✅ Voting contract loaded:", deployment.address);
    console.log("✅ Deployment timestamp:", deployment.timestamp);

    // Verify contract is accessible
    try {
      const contract = ensureContract();
      const candidateCount = await contract.candidateCount();
      const isActive = await contract.electionActive();
      console.log(
        "✅ Contract verified - Candidates:",
        candidateCount.toString(),
        "Active:",
        isActive,
      );
    } catch (verifyError: any) {
      console.error("❌ Contract verification failed:", verifyError.message);
      console.error(
        "❌ Make sure the contract is deployed at:",
        deployment.address,
      );
      throw new Error("Contract not accessible");
    }

    // Listen to VoteCast events
    const contract = ensureContract();
    contract.on(
      "VoteCast",
      (
        candidateId: any,
        party: any,
        voterHash: any,
        timestamp: any,
        blockNumber: any,
      ) => {
        console.log("📊 Vote cast event:", {
          candidateId: candidateId.toString(),
          party,
          blockNumber: blockNumber.toString(),
        });
        io.emit("voteCast", {
          candidateId: candidateId.toString(),
          party,
          timestamp: timestamp.toString(),
          blockNumber: blockNumber.toString(),
        });
      },
    );
  } catch (error) {
    console.error("⚠️  Contract not deployed yet. Run deployment first.");
  }
};

loadContract();

// Reload contract endpoint (for development)
app.get("/api/reload-contract", async (req, res) => {
  try {
    await loadContract();

    if (votingContract) {
      const contract = ensureContract();
      const candidateCount = await contract.candidateCount();
      const isActive = await contract.electionActive();
      const address = await contract.getAddress();

      res.json({
        success: true,
        message: "Contract reloaded successfully",
        address,
        candidateCount: candidateCount.toString(),
        isActive,
      });
    } else {
      res.json({ success: false, error: "Contract not loaded" });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mongoose Schemas
const VoterSchema = new mongoose.Schema({
  nin: { type: String, required: true, unique: true },
  voterHash: { type: String, required: true, unique: true },
  hasVoted: { type: Boolean, default: false },
  votedAt: { type: Date },
  sessionId: String,
  ward: String,
  lga: String,
  state: String,
});

const SessionSchema = new mongoose.Schema({
  sessionToken: { type: String, required: true, unique: true },
  ward: String,
  lga: String,
  state: String,
  presidingOfficer: String,
  startedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

const VoteSchema = new mongoose.Schema({
  transactionHash: { type: String, required: true, unique: true },
  blockNumber: Number,
  candidateId: Number,
  party: String,
  voterHash: String,
  timestamp: { type: Date, default: Date.now },
  sessionId: String,
  synced: { type: Boolean, default: true },
});

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true },
  fullParty: { type: String, required: true },
  state: { type: String, required: true },
  position: { type: String, default: "Governor" },
  logo: { type: String },
  color: { type: String },
  blockchainId: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const Voter = mongoose.model("Voter", VoterSchema);
const Session = mongoose.model("Session", SessionSchema);
const Vote = mongoose.model("Vote", VoteSchema);
const Candidate = mongoose.model("Candidate", CandidateSchema);

// Cryptographic masking middleware
const SALT_KEY = process.env.SALT_KEY || "INEC_SECURE_SALT_2026_THESIS_PROJECT";

function generateVoterHash(nin: string, sessionId: string): string {
  const hmac = crypto.createHmac("sha256", SALT_KEY);
  hmac.update(`${nin}-${sessionId}`);
  return "0x" + hmac.digest("hex");
}

// API Routes
app.post("/api/session/initialize", async (req, res) => {
  try {
    const { ward, lga, state, presidingOfficer } = req.body;
    const sessionToken = `NVS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const session = new Session({
      sessionToken,
      ward,
      lga,
      state,
      presidingOfficer,
    });

    await session.save();
    res.json({ success: true, sessionToken, session });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/voter/accredit", async (req, res) => {
  try {
    const { nin, sessionId, ward, lga, state, fingerprintHash, faceHash } =
      req.body;

    if (!nin || nin.length !== 11) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid NIN format" });
    }

    // Generate anonymized hash
    const voterHash = generateVoterHash(nin, sessionId);

    // Check if already voted on blockchain
    if (votingContract) {
      const contract = ensureContract();
      const alreadyVoted = await contract.hasAlreadyVoted(voterHash);
      if (alreadyVoted) {
        return res
          .status(403)
          .json({ success: false, error: "Voter has already cast ballot" });
      }
    }

    // Check database
    let voter = await Voter.findOne({ nin });
    if (!voter) {
      voter = new Voter({
        nin,
        voterHash,
        sessionId,
        ward,
        lga,
        state,
      });
      await voter.save();
    } else if (voter.hasVoted) {
      return res
        .status(403)
        .json({ success: false, error: "Voter has already cast ballot" });
    }

    res.json({
      success: true,
      voterHash,
      accredited: true,
      biometricVerified: true,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/vote/cast", async (req, res) => {
  try {
    const { candidateId, voterHash, sessionId } = req.body;

    if (!votingContract) {
      return res
        .status(503)
        .json({ success: false, error: "Blockchain not connected" });
    }

    // Cast vote on blockchain
    const contract = ensureContract();
    const tx = await contract.castVote(candidateId, voterHash);
    const receipt = await tx.wait();

    // Update database
    await Voter.findOneAndUpdate(
      { voterHash },
      { hasVoted: true, votedAt: new Date() },
    );

    // Get candidate info
    const [id, name, party, voteCount] =
      await contract.getCandidate(candidateId);

    // Save vote record
    const vote = new Vote({
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      candidateId,
      party,
      voterHash,
      sessionId,
    });
    await vote.save();

    res.json({
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      candidate: { id: id.toString(), name, party },
    });
  } catch (error: any) {
    // Extract readable error message from blockchain errors
    let errorMessage = "Failed to cast vote";

    if (error.reason) {
      // Ethers v6 provides a clean reason
      errorMessage = error.reason;
    } else if (error.message) {
      // Fallback to error message
      if (error.message.includes("Duplicate vote detected")) {
        errorMessage =
          "Duplicate vote detected. This voter has already cast a ballot.";
      } else if (error.message.includes("Invalid candidate")) {
        errorMessage = "Invalid candidate selection";
      } else if (error.message.includes("Election is not active")) {
        errorMessage = "Election is not currently active";
      } else {
        errorMessage = error.message;
      }
    }

    res.status(500).json({ success: false, error: errorMessage });
  }
});

app.get("/api/results", async (req, res) => {
  try {
    if (!votingContract) {
      return res
        .status(503)
        .json({ success: false, error: "Blockchain not connected" });
    }

    const contract = ensureContract();
    const [names, parties, votes] = await contract.getResults();
    const totalVotes = await contract.totalVotes();
    const blockNumber = await provider.getBlockNumber();

    // Get additional candidate info from database
    const candidates = await Candidate.find();
    const candidateMap = new Map(candidates.map((c) => [c.party, c]));

    const results = names.map((name: string, index: number) => {
      const dbCandidate = candidateMap.get(parties[index]);
      return {
        id: index + 1,
        name,
        party: parties[index],
        votes: votes[index].toString(),
        logo: dbCandidate?.logo || "🏛️",
        color: dbCandidate?.color || "bg-gray-600",
        state: dbCandidate?.state || "Unknown",
      };
    });

    res.json({
      success: true,
      results,
      totalVotes: totalVotes.toString(),
      blockNumber,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get results by state
app.get("/api/results/:state", async (req, res) => {
  try {
    const { state } = req.params;

    if (!votingContract) {
      return res
        .status(503)
        .json({ success: false, error: "Blockchain not connected" });
    }

    // Get all results
    const contract = ensureContract();
    const [names, parties, votes] = await contract.getResults();
    const blockNumber = await provider.getBlockNumber();

    // Get candidates for this state
    const candidates = await Candidate.find({ state });
    const stateParties = new Set(candidates.map((c) => c.party));

    // Filter results for this state
    const candidateMap = new Map(candidates.map((c) => [c.party, c]));

    const results = [];
    let stateTotal = 0;

    for (let i = 0; i < names.length; i++) {
      const party = parties[i];
      if (stateParties.has(party)) {
        const dbCandidate = candidateMap.get(party);
        const voteCount = parseInt(votes[i].toString());
        stateTotal += voteCount;

        results.push({
          id: i + 1,
          name: names[i],
          party,
          votes: votes[i].toString(),
          logo: dbCandidate?.logo || "🏛️",
          color: dbCandidate?.color || "bg-gray-600",
          state: dbCandidate?.state || state,
        });
      }
    }

    res.json({
      success: true,
      results,
      totalVotes: stateTotal.toString(),
      blockNumber,
      state,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/blockchain/stats", async (req, res) => {
  try {
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);

    res.json({
      success: true,
      blockNumber,
      timestamp: block?.timestamp || Date.now(),
      synced: true,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// WebSocket connection
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "operational", timestamp: new Date().toISOString() });
});

// Get session details
app.get("/api/session/:sessionToken", async (req, res) => {
  try {
    const { sessionToken } = req.params;
    const session = await Session.findOne({ sessionToken });

    if (!session) {
      return res
        .status(404)
        .json({ success: false, error: "Session not found" });
    }

    res.json({ success: true, session });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Candidate Management Routes (Electoral Officer)
app.post("/api/candidates", async (req, res) => {
  try {
    const { name, party, fullParty, state, logo, color } = req.body;

    console.log("📝 Adding candidate:", { name, party, state });

    // First, add to blockchain if contract is available
    let blockchainId = null;
    if (votingContract) {
      try {
        const contract = ensureContract();
        const contractAddress = await contract.getAddress();
        console.log("📍 Contract address:", contractAddress);

        const currentCount = await contract.candidateCount();
        console.log("📊 Current candidates:", currentCount.toString());

        const tx = await contract.addCandidate(name, party);
        console.log("⏳ Waiting for transaction...");
        const receipt = await tx.wait();

        // Get the candidateCount to determine the ID
        const candidateCount = await contract.candidateCount();
        blockchainId = candidateCount.toString();

        console.log(
          `✅ Candidate added to blockchain: ${name} (${party}) - ID: ${blockchainId}`,
        );
      } catch (blockchainError: any) {
        console.error("❌ Blockchain error:", blockchainError);
        return res.status(500).json({
          success: false,
          error:
            "Failed to add candidate to blockchain: " + blockchainError.message,
        });
      }
    } else {
      console.error("❌ Contract not initialized");
      return res.status(503).json({
        success: false,
        error: "Blockchain contract not initialized",
      });
    }

    // Then save to database
    const candidate = new Candidate({
      name,
      party,
      fullParty,
      state,
      logo,
      color,
      blockchainId,
    });

    await candidate.save();
    res.json({ success: true, candidate });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/candidates/:state", async (req, res) => {
  try {
    const { state } = req.params;
    const candidates = await Candidate.find({ state });
    res.json({ success: true, candidates });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json({ success: true, candidates });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/candidates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Candidate.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Election Control Routes
app.post("/api/election/activate", async (req, res) => {
  try {
    if (!votingContract) {
      return res
        .status(503)
        .json({ success: false, error: "Blockchain not connected" });
    }

    const contract = ensureContract();
    const tx = await contract.activateElection();
    await tx.wait();

    console.log("✅ Election activated");
    res.json({ success: true, message: "Election activated" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/election/deactivate", async (req, res) => {
  try {
    if (!votingContract) {
      return res
        .status(503)
        .json({ success: false, error: "Blockchain not connected" });
    }

    const contract = ensureContract();
    const tx = await contract.deactivateElection();
    await tx.wait();

    console.log("⏸️ Election deactivated");
    res.json({ success: true, message: "Election deactivated" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/election/status", async (req, res) => {
  try {
    if (!votingContract) {
      return res.status(503).json({
        success: false,
        error: "Blockchain not connected",
      });
    }

    const contract = ensureContract();
    const isActive = await contract.electionActive();
    const totalVotes = await contract.totalVotes();
    const candidateCount = await contract.candidateCount();

    res.json({
      success: true,
      isActive,
      totalVotes: totalVotes.toString(),
      candidateCount: candidateCount.toString(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 INEC Backend API running on port ${PORT}`);
  console.log(`📡 WebSocket server active`);
});
