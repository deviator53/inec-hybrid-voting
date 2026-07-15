# INEC NEVS - Production Deployment Guide

**⚠️ ACADEMIC THESIS PROJECT - Deployment Guide for Research/Demo Purposes**

---

## Quick Reference

### What You'll Deploy

1. **Smart Contract** → Polygon Amoy Testnet (free)
2. **Backend API** → Railway or Render (free tier)
3. **Frontend** → Vercel or Netlify (free tier)
4. **Hardware Bridge** → Optional - Railway/Render (for biometric simulation)

### Total Cost: $0 (Using Free Tiers)

### Two Ways to Deploy

| Method               | Best For                         | Tools Needed                 |
| -------------------- | -------------------------------- | ---------------------------- |
| **Manual Dashboard** | Beginners, first-time deployers  | Just a browser               |
| **CLI Tools**        | Developers, repeated deployments | npm, railway-cli, vercel-cli |

### Time Estimate

- First-time deployment: 30-45 minutes
- With CLI experience: 15-20 minutes

---

## Overview

This guide covers deploying the INEC Hybrid Blockchain-Based Electronic Voting System (NEVS) to cloud platforms for academic demonstration and research purposes.

### Deployment Methods Available

**✅ Manual Web Dashboard (Recommended for Beginners)**:

- Point-and-click interface
- No CLI tools needed
- Easy to follow
- Sections 4-6 include "Method 1: Manual" instructions

**⚡ Command Line Interface (For Advanced Users)**:

- Faster for repeated deployments
- Requires installing CLI tools globally
- More automation
- See "Method 2: CLI" in sections 4-6

Both methods achieve the same result - choose what you're comfortable with!

## System Architecture

```
NEVS Stack:
├── Frontend: Next.js 14 (Vercel/Netlify recommended)
├── Backend: Node.js/Express + Socket.io (Railway/Render recommended)
├── Hardware Bridge: Python Flask microservice (Railway/Render)
├── Blockchain: Ethereum-compatible network (Polygon Amoy testnet)
└── Database: MongoDB Atlas (cloud-hosted)
```

---

## 1. Prerequisites

### Required Accounts

- [ ] MongoDB Atlas account (free tier available at mongodb.com/cloud/atlas)
- [ ] Vercel/Netlify account (for frontend hosting)
- [ ] Railway/Render account (for backend and hardware bridge)
- [ ] Alchemy account (for Polygon Amoy RPC - dashboard.alchemy.com)
- [ ] Domain name (optional but recommended for production demos)

### Required Tools

Install the CLI tools for your chosen platforms:

```bash
# Vercel CLI
npm install -g vercel

# OR Netlify CLI
npm install -g netlify-cli

# Railway CLI
npm install -g @railway/cli
```

---

## 2. Database Setup (MongoDB Atlas)

### Step 1: Create Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Choose a cloud provider and region closest to your users
4. Wait for cluster to be provisioned (2-5 minutes)

### Step 2: Configure Network Access

1. Go to Network Access → Add IP Address
2. Add `0.0.0.0/0` for production (allows access from anywhere)
3. Or whitelist specific IPs for better security

### Step 3: Create Database User

1. Go to Database Access → Add New Database User
2. Choose password authentication
3. Save username and password securely

### Step 4: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. **Database name is set via the connection string path** (no need to create manually)

Example connection string format:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?appName=Cluster0
```

**Note**: The system will automatically create the necessary collections (voters, sessions, votes) on first use.

---

## 3. Blockchain Setup

### Get Free Test MATIC First!

Before deploying, you need test tokens:

1. Visit **https://faucet.polygon.technology/**
2. Connect your wallet OR paste your address
3. Select "Polygon Amoy" testnet
4. Complete verification (CAPTCHA/social)
5. Click "Submit" - tokens arrive in 1-2 minutes
6. Can claim once every 24 hours per address

✅ You're now ready to deploy to Amoy testnet!

---

### Option A: Use a Public Testnet (Recommended for Testing)

**Polygon Amoy Testnet** (Free - Mumbai is deprecated):

1. Get RPC URL from Alchemy:
   - Sign up at https://www.alchemy.com/
   - Create new app → Choose Polygon → Select "Amoy" testnet
   - Copy HTTPS endpoint: `https://polygon-amoy.g.alchemy.com/v2/YOUR-API-KEY`

2. Get test MATIC from Polygon Faucet:
   - Visit https://faucet.polygon.technology/
   - Connect your wallet OR paste your wallet address
   - Select "Polygon Amoy" testnet from dropdown
   - Complete CAPTCHA or social verification if required
   - Click "Submit" to receive free test MATIC
   - Tokens arrive within 1-2 minutes (check your wallet)
   - You can claim once every 24 hours per address

3. Update all environment files with your Alchemy RPC URL:

**blockchain/.env**:

```
ALCHEMY_AMOY_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR-API-KEY
DEPLOYER_PRIVATE_KEY=your-wallet-private-key
```

**frontend/.env.local**:

```
NEXT_PUBLIC_BLOCKCHAIN_RPC=https://polygon-amoy.g.alchemy.com/v2/YOUR-API-KEY
NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

**backend/.env**:

```
BLOCKCHAIN_RPC=https://polygon-amoy.g.alchemy.com/v2/YOUR-API-KEY
PRIVATE_KEY=your-wallet-private-key
```

**⚠️ IMPORTANT**:

- Use the same Alchemy API key across all files for consistency
- Never commit .env files to version control
- Contract address will be available after deployment

**Deploy Contract:**

```bash
cd blockchain
npx hardhat run scripts/deploy.ts --network amoy
```

### Option B: Use Mainnet (Production)

**Polygon Mainnet**:

1. Get RPC from Alchemy (Polygon Mainnet)
2. Fund your deployer wallet with real MATIC
3. Deploy:

```bash
npx hardhat run scripts/deploy.ts --network polygon
```

### Update hardhat.config.ts

```typescript
networks: {
  localhost: {
    url: "http://127.0.0.1:8545"
  },
  amoy: {
    url: process.env.ALCHEMY_AMOY_URL || "https://polygon-amoy.g.alchemy.com/v2/YOUR-API-KEY",
    accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    chainId: 80002
  },
  polygon: {
    url: process.env.ALCHEMY_POLYGON_URL || "https://polygon-mainnet.g.alchemy.com/v2/YOUR-API-KEY",
    accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    chainId: 137
  }
}
```

**Note**: Configuration already updated in your project!

---

## 4. Backend API Deployment

**Note**: The backend includes Socket.io for real-time WebSocket events. Ensure your hosting platform supports WebSockets.

### Option A: Railway (Recommended - WebSocket Support Included)

#### Method 1: Manual Deployment via Web Dashboard (Easiest)

1. **Push Code to GitHub**:

   ```bash
   # Ensure your backend code is pushed to GitHub
   git add .
   git commit -m "Backend ready for deployment"
   git push origin main
   ```

2. **Create Railway Project**:
   - Go to https://railway.app/
   - Sign up/Login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js

3. **Configure Root Directory**:
   - Click on your service
   - Go to Settings → Service
   - Set **Root Directory**: `backend`
   - Set **Start Command**: `npm start`

4. **Add Environment Variables**:
   - Go to Variables tab
   - Click "RAW Editor" and paste:

   ```env
   MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?appName=Cluster0
   BLOCKCHAIN_RPC=https://polygon-amoy.g.alchemy.com/v2/YOUR-API-KEY
   PRIVATE_KEY=0xYOUR_WALLET_PRIVATE_KEY
   SALT_KEY=INEC_SECURE_SALT_2026_THESIS_PROJECT
   FRONTEND_URL=https://your-frontend.vercel.app
   PORT=5000
   ```

5. **Generate Public Domain**:
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Copy your Railway URL: `https://your-app.railway.app`

6. **Verify Deployment**:
   - Check Deployments tab for build logs
   - Visit: `https://your-app.railway.app/health`
   - Should see: `{"status": "healthy"}`

**✅ Benefits**: Free $5 credit/month, WebSocket support, auto-deploy on push

#### Method 2: CLI Deployment

1. **Install Railway CLI**:

```bash
npm install -g @railway/cli
railway login
```

2. **Initialize Project**:

```bash
cd backend
railway init
```

3. **Set Environment Variables**:

```bash
# Database connection
railway variables set MONGO_URI="mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?appName=Cluster0"

# Blockchain connection (use your Alchemy Amoy API key)
railway variables set BLOCKCHAIN_RPC="https://polygon-amoy.g.alchemy.com/v2/YOUR-API-KEY"

# Wallet private key (for signing transactions)
railway variables set PRIVATE_KEY="0xYOUR_WALLET_PRIVATE_KEY"

# Security salt for HMAC voter anonymization
railway variables set SALT_KEY="INEC_SECURE_SALT_2026_THESIS_PROJECT"

# CORS configuration
railway variables set FRONTEND_URL="https://your-frontend-domain.vercel.app"

# Port
railway variables set PORT=5000
```

**⚠️ Critical Security Notes**:

- Use the EXACT Alchemy Amoy URL from your dashboard (wrong RPC = failed transactions)
- Never use your mainnet wallet - create a new wallet specifically for testnet
- Get test MATIC from https://faucet.polygon.technology/ before deploying
- Generate a strong SALT_KEY for production (min 32 random characters)
- The PRIVATE_KEY must start with `0x`

4. **Deploy**:

```bash
railway up
```

5. **Get Backend URL**:

```bash
railway domain
# Example: https://your-app.railway.app
```

### Option B: Render (Free Tier Available)

#### Manual Deployment via Web Dashboard (Recommended)

1. **Push Code to GitHub** (if not already done)

2. **Create Web Service**:
   - Go to https://render.com/
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository and authorize access

3. **Configure Service**:
   - **Name**: `inec-voting-backend`
   - **Region**: Choose closest to your users (e.g., Oregon USA, Frankfurt EU)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add Environment Variables**:
   Scroll down to "Environment Variables" and add:

   ```
   MONGO_URI = mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?appName=Cluster0
   BLOCKCHAIN_RPC = https://polygon-amoy.g.alchemy.com/v2/YOUR-API-KEY
   PRIVATE_KEY = 0xYOUR_WALLET_PRIVATE_KEY
   SALT_KEY = INEC_SECURE_SALT_2026_THESIS_PROJECT
   FRONTEND_URL = https://your-frontend.vercel.app
   PORT = 5000
   ```

5. **Choose Plan**:
   - **Free Tier**: Select "Free" (spins down after 15 min inactivity)
   - **Paid**: $7/month for always-on service

6. **Deploy**:
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - Get your URL: `https://inec-voting-backend.onrender.com`

7. **Test**:
   - Visit: `https://your-app.onrender.com/health`
   - Should return: `{"status": "healthy"}`

**⚠️ Note**: Free tier spins down after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up.

**✅ Benefits**: True free tier (no credit card required), auto-deploy on push, WebSocket support

### Option C: AWS EC2 (Advanced)

See `DEPLOYMENT-AWS.md` for detailed AWS setup.

---

## 5. Hardware Bridge Deployment (Optional)

**Purpose**: The Python Flask microservice simulates biometric hardware (fingerprint scanner, face camera, thermal printer). For demo purposes, you can either:

- Deploy it to Railway/Render (recommended for complete system)
- Run it locally on your demo machine
- Skip it and mock the hardware responses in the frontend

### Deploy to Railway

1. **Create New Project**:

```bash
cd hardware-bridge
railway init
```

2. **Add Python buildpack** (Railway auto-detects `requirements.txt`)

3. **Set Environment Variables**:

```bash
railway variables set PORT=5050
```

4. **Deploy**:

```bash
railway up
```

5. **Update Frontend**:
   - Copy the hardware bridge URL (e.g., `https://hardware-bridge.railway.app`)
   - Update frontend API calls to use this URL instead of `http://localhost:5050`

---

## 6. Frontend Deployment

### Option A: Vercel (Recommended - Best Next.js Support)

#### Method 1: Manual Deployment via Web Dashboard (Easiest)

1. **Push Code to GitHub**:

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Configure Build Settings**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. **Add Environment Variables**:
   - Click "Environment Variables" section
   - Add these three variables:

   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_BLOCKCHAIN_RPC=https://polygon-amoy.g.alchemy.com/v2/YOUR-API-KEY
   NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build completion
   - Get your live URL: `https://your-project.vercel.app`

6. **Update Backend CORS**:
   - Go back to Railway
   - Update `FRONTEND_URL` variable with your new Vercel URL

**✅ Benefits**: Auto-deploys on every git push, free SSL, CDN, preview deployments

#### Method 2: CLI Deployment

```bash
npm install -g vercel
cd frontend
vercel login
vercel
# Follow prompts, then set env vars in dashboard
vercel --prod
```

### Option B: Netlify

#### Method 1: Manual Deployment via Web Dashboard (Easiest)

1. **Push Code to GitHub** (if not already done)

2. **Connect to Netlify**:
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.next`

4. **Add Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add the same three variables as Vercel above

5. **Deploy**:
   - Click "Deploy site"
   - Get your URL: `https://random-name.netlify.app`

6. **Custom Domain** (optional):
   - Go to Domain Settings
   - Add your custom domain

#### Method 2: CLI Deployment

```bash
npm install -g netlify-cli
cd frontend
netlify login
netlify init
# Set env vars in dashboard
netlify deploy --prod
```

---

## 7. Update Frontend API URLs

The frontend currently uses hardcoded `http://localhost:5000` in fetch calls. Update these to use your production backend URL.

### Method 1: Environment Variable (Recommended)

Add to the top of each page component:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
```

Then replace all `http://localhost:5000` with `${API_URL}` in fetch calls:

```typescript
// Before
const response = await fetch("http://localhost:5000/api/vote/cast", { ... });

// After
const response = await fetch(`${API_URL}/api/vote/cast`, { ... });
```

**Files to update**:

- `frontend/src/app/setup/page.tsx`
- `frontend/src/app/accreditation/page.tsx`
- `frontend/src/app/ballot/page.tsx`
- `frontend/src/app/audit-observer/page.tsx`

### Method 2: Quick Find & Replace (Linux/Mac)

```bash
cd frontend/src
find . -type f -name "*.tsx" -exec sed -i 's|http://localhost:5000|https://your-backend.railway.app|g' {} +
```

### Method 3: Manual Search (Windows)

```bash
cd frontend\src
# Use your IDE's find-and-replace (Ctrl+Shift+H)
# Find: http://localhost:5000
# Replace: https://your-backend.railway.app
```

---

## 8. Copy Deployment Files to Backend

The backend needs the compiled smart contract ABI and deployment address to interact with the blockchain.

### Step 1: Copy Files Locally

After deploying your contract to Amoy:

```bash
# Windows (from project root)
copy blockchain\deployment.json backend\deployment.json
xcopy blockchain\artifacts backend\artifacts /E /I

# Linux/Mac (from project root)
cp blockchain/deployment.json backend/deployment.json
cp -r blockchain/artifacts backend/artifacts
```

### Step 2: Update .gitignore (IMPORTANT!)

The root `.gitignore` currently excludes `deployment.json` and `artifacts/`. You need to allow them for backend deployment:

**Option A: Use force add (recommended)**:

```bash
cd backend
git add -f deployment.json artifacts/
git commit -m "Add blockchain contract artifacts for Amoy deployment"
git push
```

**Option B: Update .gitignore** (if you want automatic tracking):
Edit root `.gitignore` and comment out these lines:

```
# deployment.json     # Comment this out
# artifacts/          # Comment this out
```

Then commit:

```bash
git add backend/deployment.json backend/artifacts/
git commit -m "Add blockchain deployment files"
git push
```

**⚠️ Important Notes**:

- These files contain NO sensitive data (just contract ABI and addresses)
- **`.env` files are ALWAYS excluded** by `.gitignore` - they are NEVER committed
- **`node_modules/` folders are ALWAYS excluded** - dependencies are installed during deployment
- Deployment artifacts are safe to commit and necessary for Railway/Render/Vercel
- The `-f` flag forces git to add files that are normally ignored

**What's in .gitignore (protected from commits)**:

```
✅ .env, .env.local          # Contains private keys - NEVER COMMIT
✅ node_modules/              # Too large, installed during build
✅ venv/                      # Python dependencies
❌ deployment.json            # Safe to commit (we use -f flag)
❌ artifacts/                 # Safe to commit (we use -f flag)
```

### Step 3: Verify Backend Access

After deployment, check your backend logs to confirm contract loading:

```bash
railway logs
# Should see: "Connected to blockchain: Polygon Amoy"
# Should see: "Contract loaded at: 0xYOUR_ADDRESS"
```

---

## 9. Security Hardening for Production Demos

### Environment Variables Protection

**What's Already Protected**:

- ✅ `.env` files in `.gitignore` - NEVER committed to git
- ✅ `node_modules/` in `.gitignore` - Too large, reinstalled during build
- ✅ Private keys only stored in hosting platform's secure vault

**Verify .gitignore is working**:

```bash
git status
# Should NOT show:
# - .env or .env.local files
# - node_modules/ folders
# - venv/ folders
```

**Best Practices**:

- [ ] Never commit `.env` files to git (already in `.gitignore`)
- [ ] Store secrets in hosting platform's environment variable manager only
- [ ] Use strong SALT_KEY (32+ random characters, no spaces)
- [ ] Generate unique SALT_KEY for production (don't use default)
- [ ] Keep private keys in secure vault (1Password, Bitwarden)
- [ ] Rotate PRIVATE_KEY monthly for long-running demos
- [ ] Use testnet wallets only - never mainnet private keys

**Generate secure salt key**:

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Python
python -c "import secrets; print(secrets.token_hex(32))"
```

### CORS Configuration

Update `backend/src/server.ts` to whitelist only your frontend:

```typescript
import cors from "cors";

app.use(
  cors({
    origin: [
      "https://your-frontend.vercel.app",
      "https://your-custom-domain.com",
    ],
    credentials: true,
  }),
);
```

**⚠️ Remove** `origin: "*"` from production builds!

### Rate Limiting (Prevent Abuse)

Protect your demo from spam attacks:

```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/", limiter);
```

### HTTPS Only

- ✅ Vercel/Netlify use HTTPS by default
- ✅ Railway/Render use HTTPS by default
- [ ] Force HTTPS redirects in Next.js middleware if using custom domain

### MongoDB Security

- [ ] Enable IP whitelisting (don't use 0.0.0.0/0 in production)
- [ ] Use strong database passwords (20+ characters)
- [ ] Enable MongoDB audit logs
- [ ] Set up backup retention policy

---

## 9. Domain Configuration (Optional)

### Frontend (Vercel)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Backend (Railway)

1. Go to Railway Dashboard → Your Project → Settings
2. Add custom domain
3. Update DNS with CNAME record

---

## 10. Post-Deployment Checklist

- [ ] Test voter accreditation flow
- [ ] Test ballot casting
- [ ] Verify blockchain transactions on Amoy explorer (https://amoy.polygonscan.com/)
- [ ] Check live results dashboard updates in real-time
- [ ] Test electoral officer candidate management
- [ ] Verify MongoDB data persistence
- [ ] Check WebSocket connections work
- [ ] Test on mobile devices
- [ ] Load test with multiple concurrent users
- [ ] Backup private keys and seed phrases

---

## 11. Monitoring & Maintenance

### Backend Monitoring

```bash
# Railway logs
railway logs

# Render logs
# Available in dashboard
```

### MongoDB Monitoring

- Go to MongoDB Atlas → Metrics
- Set up alerts for high connection count, storage, etc.

### Blockchain Monitoring

- Check contract on block explorer
- Monitor gas costs
- Set up transaction alerts

### Uptime Monitoring

Use services like:

- UptimeRobot (free)
- Pingdom
- Better Uptime

---

## 12. Backup Strategy

### Database Backups

MongoDB Atlas automatically backs up every 24 hours (free tier: 2-day retention)

### Code Backups

- Push to GitHub/GitLab regularly
- Tag releases: `git tag v1.0.0`

### Contract Backups

- Save deployment.json
- Save contract addresses
- Keep private keys in secure vault (e.g., 1Password, Bitwarden)

---

## 13. Scaling Considerations

### If expecting high traffic:

**Backend**:

- Scale horizontally on Railway/Render
- Use Redis for caching
- Implement queue system (Bull/BullMQ)

**Database**:

- Upgrade MongoDB Atlas tier
- Enable sharding for large datasets

**Blockchain**:

- Use faster networks (Polygon over Ethereum)
- Batch transactions where possible
- Implement transaction queuing

---

## 14. Costs Estimate

**Free Tier (Testing with Polygon Amoy)**:

- MongoDB Atlas: Free (512MB storage, M0 cluster)
- Railway: Free tier - $5 credit/month (500 hours execution)
- Vercel: Free for personal projects (100GB bandwidth)
- Alchemy: Free tier - 300M compute units/month
- Polygon Amoy Testnet: **Completely free** (get test MATIC from https://faucet.polygon.technology/)

**Total: $0/month for testing and academic use**

**Note**: Polygon Mumbai testnet was deprecated in April 2024. Always use Polygon Amoy for testing.

**Production (Small Scale)**:

- MongoDB Atlas: $0-25/month
- Railway: $5-20/month
- Vercel: $0-20/month
- Polygon Mainnet: Gas fees ~$0.01-0.10 per transaction
  **Total: ~$30-70/month + transaction fees**

---

## 15. Troubleshooting

### Backend can't connect to MongoDB

- Check IP whitelist in MongoDB Atlas
- Verify connection string format
- Check environment variable is set correctly

### Frontend can't reach backend

- Verify CORS settings
- Check backend URL is correct
- Ensure backend is running

### Blockchain transactions failing

- Check wallet has sufficient funds
- Verify RPC endpoint is responding
- Check network is correct (testnet vs mainnet)

### Contract not loading

- Ensure deployment.json exists on backend
- Verify artifacts directory is present
- Check contract address is valid

---

## 16. Support & Resources

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app/
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Alchemy: https://docs.alchemy.com/
- Hardhat: https://hardhat.org/getting-started/

---

## Quick Deploy Summary

### Manual Deployment (Recommended for Beginners)

1. **Get Test Tokens**:
   - Visit https://faucet.polygon.technology/
   - Claim Amoy MATIC for your wallet

2. **Deploy Smart Contract**:

   ```bash
   cd blockchain
   npx hardhat run scripts/deploy.ts --network amoy
   # Save the contract address from output
   ```

3. **Copy Deployment Files**:

   ```bash
   # Windows
   copy blockchain\deployment.json backend\deployment.json
   xcopy /E /I blockchain\artifacts backend\artifacts

   # Commit to git
   git add backend/deployment.json backend/artifacts/
   git commit -m "Add deployment files"
   git push
   ```

4. **Deploy Backend (Railway Dashboard)**:
   - Go to https://railway.app/
   - Import GitHub repo → Select `backend` folder
   - Add environment variables (see section 4)
   - Auto-deploys from git

5. **Deploy Frontend (Vercel Dashboard)**:
   - Go to https://vercel.com/
   - Import GitHub repo → Select `frontend` folder
   - Add environment variables (see section 6)
   - Click Deploy

6. **Update URLs**:
   - Copy backend URL from Railway
   - Update `NEXT_PUBLIC_API_URL` in Vercel
   - Update `FRONTEND_URL` in Railway (for CORS)

### CLI Deployment (For Advanced Users)

```bash
# 1. Deploy contract to Amoy
cd blockchain
npx hardhat run scripts/deploy.ts --network amoy

# 2. Copy artifacts (Windows)
cd ..
copy blockchain\deployment.json backend\deployment.json
xcopy /E /I blockchain\artifacts backend\artifacts

# 3. Deploy backend (Railway CLI)
cd backend
railway login
railway init
railway up

# 4. Deploy frontend (Vercel CLI)
cd ../frontend
vercel login
vercel --prod
```

---

**Need help?** Check the troubleshooting section or create an issue in the repository.
