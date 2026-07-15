# INEC Hybrid Blockchain-Based Electronic Voting System (NEVS)

**⚠️ ACADEMIC THESIS PROJECT - NOT FOR PRODUCTION USE**

A complete blockchain-based electronic voting system implementation for academic research purposes, demonstrating secure, transparent, and immutable electoral processes.

## 🏗️ Architecture

```
inec-hybrid-voting/
├── blockchain/          # Ethereum-compatible voting smart contract (Hardhat + Solidity)
├── backend/             # Node.js/Express API gateway (MongoDB + ethers.js)
├── hardware-bridge/     # Python Flask microservice (Hardware simulation)
└── frontend/            # Next.js 14 client application (Tailwind CSS + WebSocket)
```

## 🎨 Features Implemented

### ✅ Pages Matching UI Designs

1. **Setup Page** (`/setup`) - Session initialization with hardware status checks
2. **Accreditation Page** (`/accreditation`) - Dark-themed biometric verification interface
3. **Ballot Page** (`/ballot`) - Clean grid layout with 8 candidates
4. **Confirmation Modal** - Double-verification overlay
5. **Success Modal** - Transaction hash display with printing status
6. **Audit Observer Dashboard** (`/audit-observer`) - Real-time blockchain monitoring

### 🔐 Security Features

- **HMAC-SHA256 Voter Anonymization**: Identity decoupling before blockchain writes
- **Double Voting Prevention**: Blockchain-enforced duplicate detection
- **End-to-End Encryption**: TLS 1.3 transport layer security
- **Immutable Audit Trail**: All votes permanently recorded on blockchain

### 🔧 Technical Integrations

- **Smart Contract**: `ElectorateVoting.sol` with 8 candidates and event emissions
- **WebSocket Events**: Real-time vote cast notifications
- **IndexedDB Caching**: Offline-first architecture with sync recovery
- **Hardware Simulation**: Fingerprint scanner, thermal printer, camera endpoints

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.8+
- MongoDB running on `localhost:27017`

### 1. Blockchain Setup

```bash
cd blockchain
npm install
npx hardhat node
# In new terminal:
npx hardhat run scripts/deploy.ts --network localhost
```

### 2. Backend API

```bash
cd backend
npm install
npm run dev
```

### 3. Hardware Bridge

```bash
cd hardware-bridge
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Hardware Bridge**: http://localhost:5050
- **Blockchain RPC**: http://localhost:8545

## 📋 User Flow

1. **Initialize Session** → Setup page with State/LGA/Ward selection
2. **Accredit Voter** → Enter 11-digit NIN + biometric scan
3. **Cast Ballot** → Select candidate from 8-option grid
4. **Confirm Vote** → Double-check modal with warning
5. **Receipt** → Transaction hash + thermal printer simulation
6. **Audit** → Real-time observer dashboard with live tally

## 🎯 Candidate Data

1. Ahmed Usman Bello - APC
2. Ibrahim Musa Sheriff - PDP
3. Fatima Aliyu Dangote - LP
4. Yakubu Tanko Ibrahim - NNPP
5. Sunday Okonkwo James - ADC
6. Hauwa Garba Umar - SDP
7. Chukwuemeka Obi Nwosu - YPP
8. Musa Abdullahi Kano - ZLP

## 🎨 Color Palette (INEC Official)

- **Primary Green**: `#0d5c3d`
- **Dark Background**: `#021c11`
- **Ballot Cream**: `#f9f7f3`
- **Accent Green**: `#22c55e`

## 📦 Technology Stack

| Layer            | Technology                     |
| ---------------- | ------------------------------ |
| Smart Contract   | Solidity ^0.8.24               |
| Blockchain       | Hardhat (local Ethereum)       |
| Backend          | Node.js + Express + TypeScript |
| Database         | MongoDB + Mongoose             |
| Real-time        | Socket.io                      |
| Hardware Bridge  | Python Flask                   |
| Frontend         | Next.js 14 + TypeScript        |
| Styling          | Tailwind CSS                   |
| State Management | React Hooks + IndexedDB        |

## 🔬 Testing

```bash
# Blockchain tests
cd blockchain
npx hardhat test

# Backend API health check
curl http://localhost:5000/health

# Hardware bridge health check
curl http://localhost:5050/health
```

## 📊 API Endpoints

### Backend (Port 5000)

- `POST /api/session/initialize` - Create voting session
- `POST /api/voter/accredit` - Accredit voter with NIN
- `POST /api/vote/cast` - Cast vote to blockchain
- `GET /api/results` - Fetch current vote tally
- `GET /api/blockchain/stats` - Get blockchain sync status

### Hardware Bridge (Port 5050)

- `GET /api/hardware/status` - Check peripheral status
- `POST /api/biometric/fingerprint/scan` - Simulate fingerprint capture
- `POST /api/biometric/face/capture` - Simulate face recognition
- `POST /api/printer/print-receipt` - Simulate VVPAT printing
- `GET /api/blockchain/sync-status` - Node synchronization info

## 🚨 Disclaimer

This is an **academic thesis project** for educational and research purposes only. It demonstrates blockchain voting concepts and is NOT intended for use in actual electoral processes. Production deployment would require:

- Comprehensive security audits
- Legal compliance verification
- Official INEC authorization
- Professional penetration testing
- Formal certification processes

## 📝 License

Academic Research Project - Not for Production Use

## 👨‍💻 Development Notes

- Mock hardware endpoints return simulated data
- Blockchain uses Hardhat's local network (not mainnet)
- Default private key is for development only
- Session tokens are simplified for demo purposes
- Real biometric integration would require vendor SDKs

---

**Built for Academic Thesis Research | Federal Republic of Nigeria Electoral System Study**
