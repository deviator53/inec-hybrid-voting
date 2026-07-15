# ⚡ INEC NEVS - 5-Minute Quick Start

Get the system running in 5 simple steps.

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ Python 3.8+ installed
- ✅ MongoDB running

## 🚀 Steps

### 1. Install All Dependencies (One-Time)

```bash
# Double-click or run:
INSTALL-DEPENDENCIES.bat
```

**Wait**: ~5-10 minutes for all packages to install

### 2. Start All Services

```bash
# Double-click or run:
START-ALL-SERVICES.bat
```

**This opens 6 terminal windows**:

1. MongoDB confirmation
2. Blockchain Node (Hardhat)
3. Contract Deployment
4. Backend API
5. Hardware Bridge
6. Frontend

**Wait**: ~30 seconds for everything to initialize

### 3. Open Browser

Navigate to: **http://localhost:3000**

### 4. Test the System

#### A. Initialize Session

1. Select: **Niger State** → **Bosso LGA** → **Maikunkele Ward 02**
2. Click **"START ELECTION SESSION"**

#### B. Accredit Voter

1. Enter NIN: `12345678901` (any 11 digits)
2. Click **"Start Biometric Scan"**
3. Wait 3 seconds for capture

#### C. Cast Vote

1. Click any candidate card (e.g., **Ibrahim Musa Sheriff - PDP**)
2. Review confirmation modal
3. Click **"CAST BALLOT"**
4. View transaction hash and receipt

#### D. View Audit Dashboard

Navigate to: **http://localhost:3000/audit-observer**

- See your vote in the blockchain pulse stream
- Check updated tally bars

## ✅ Success Indicators

You should see:

- ✅ All hardware status showing "CONNECTED" (green)
- ✅ Blockchain height updating in headers
- ✅ Transaction hash after voting
- ✅ Vote count incremented on dashboard
- ✅ Receipt printing simulation

## 🛑 Troubleshooting

### Problem: "MongoDB connection error"

**Solution**: Start MongoDB

```bash
net start MongoDB
# or manually:
mongod
```

### Problem: "Port 3000 already in use"

**Solution**: Kill the process

```bash
netstat -ano | findstr :3000
taskkill /PID <number> /F
```

### Problem: Contract not deployed

**Solution**: Wait 10 seconds after blockchain starts, then:

```bash
cd blockchain
npx hardhat run scripts/deploy.ts --network localhost
```

## 📊 What You'll See

### Setup Page

- Official INEC green theme
- 3 hardware status cards (all green)
- State/LGA/Ward dropdowns
- Green "START SESSION" button

### Accreditation Page

- Dark terminal theme
- NIN input (monospace font)
- Biometric scanner frames
- Real-time status updates

### Ballot Page

- Clean cream background
- 8 candidate cards in 2x4 grid
- Party color badges
- Block height in header

### Success Modal

- Green checkmark
- Full transaction hash
- Block confirmation
- Printer progress bar

### Audit Dashboard

- Left: Live blockchain feed
- Right: Vote tally bars
- Bottom: 4 stat cards

## 🎓 Academic Note

This is a **thesis demonstration project**. All data is simulated and runs locally on your machine. No real biometric data or production blockchain networks are used.

## 📞 Need Help?

See **DEPLOYMENT-GUIDE.md** for detailed troubleshooting steps.

---

**Total Time**: ~5 minutes from install to first vote cast  
**System Requirements**: 4GB RAM, 500MB disk space  
**Browser**: Chrome, Firefox, Edge, or Safari (latest versions)
