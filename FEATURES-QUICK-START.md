# Quick Start Guide - Electoral Features

## Setup & Running

### 1. Start All Services

```bash
START-ALL-SERVICES.bat
```

This will start:

- MongoDB (port 27017)
- Hardhat blockchain (port 8545)
- Backend API (port 5000)
- Frontend (port 3000)
- Hardware Bridge (port 5001)

### 2. Access the Applications

**Homepage**

```
http://localhost:3000
```

**Electoral Officer Portal** (Add/Remove Candidates)

```
http://localhost:3000/electoral-officer
```

**Live Results Dashboard** (Public View)

```
http://localhost:3000/live-polls
```

---

## Electoral Officer - Add Candidates

1. Go to `http://localhost:3000/electoral-officer`
2. Click "➕ Add New Candidate"
3. Fill in the form:
   - Candidate Name: `JOHN DOE SMITH`
   - State: Select from dropdown
   - Party Code: `APC` (or any 3-4 letter code)
   - Full Party Name: `ALL PROGRESSIVES CONGRESS`
   - Logo: Click an emoji (🏛️ ☂️ ⚒️ etc.)
   - Color: Click a color swatch
4. Click "Add Candidate"
5. Candidate appears in the list below

### Example Candidates to Add

**Lagos - Candidate 1**

- Name: BABAJIDE SANWO-OLU
- Party: APC
- Full Party: ALL PROGRESSIVES CONGRESS
- State: Lagos
- Logo: 🏛️
- Color: Green

**Lagos - Candidate 2**

- Name: GBADEBO RHODES-VIVOUR
- Party: LP
- Full Party: LABOUR PARTY
- State: Lagos
- Logo: ☂️
- Color: Red

**Rivers - Candidate 1**

- Name: SIMINALAYI FUBARA
- Party: PDP
- Full Party: PEOPLES DEMOCRATIC PARTY
- State: Rivers
- Logo: ☂️
- Color: Green

---

## Live Results Dashboard

### Viewing Results

1. Go to `http://localhost:3000/live-polls`
2. Results display automatically
3. Watch for:
   - 🟢 Live connection status (top right)
   - Auto-refresh indicator
   - Total votes count
   - Current leader (if votes > 0)

### Features

**State Filter**

- Dropdown in header
- Select any state to see state-specific results
- "All States" shows national results

**View Modes**

- 📊 Chart: Visual bars with percentages
- 📋 Table: Detailed spreadsheet view

**Auto-Refresh**

- Toggle ON/OFF in header
- When ON: Updates every 5 seconds
- Manual refresh button always available

**Real-Time Updates**

- WebSocket connection
- Instant updates when votes are cast
- No page reload needed

---

## Testing the Complete Flow

### Step 1: Add Candidates

1. Open Electoral Officer page
2. Add 2-3 candidates for "Lagos" state
3. Verify they appear in the list

### Step 2: Initialize Voting Session

1. Go to homepage → "Initialize Polling Station"
2. Fill in session details (any test data)
3. Note the session token

### Step 3: Cast Some Votes

1. Go to Accreditation page
2. Enter test NIN (11 digits, e.g., 12345678901)
3. Complete biometric (any test data)
4. Go to Ballot page
5. Vote for a candidate
6. See blockchain confirmation

### Step 4: Watch Live Results

1. Open Live Polls page
2. See vote count increase
3. Watch leader change in real-time
4. Try filtering by state
5. Toggle between Chart and Table views

---

## Common Issues & Solutions

### No candidates showing

- Make sure backend is running (port 5000)
- Check MongoDB is running
- Add candidates via Electoral Officer page

### Results not updating

- Check WebSocket connection (green dot)
- Verify backend is running
- Click manual refresh
- Check browser console for errors

### "Offline" status

- Backend might not be running
- Check `http://localhost:5000/health`
- Restart backend service

### Votes not appearing

- Ensure blockchain is deployed
- Check contract is loaded in backend logs
- Verify vote was successful on ballot page

---

## Demo Data Script

Run this to quickly populate test candidates:

**Candidate Set 1 - Lagos**

1. BABAJIDE SANWO-OLU (APC) 🏛️ Green
2. GBADEBO RHODES-VIVOUR (LP) ⚒️ Red
3. ABDUL-AZEEZ ADEDIRAN (PDP) ☂️ Green

**Candidate Set 2 - Rivers**

1. SIMINALAYI FUBARA (PDP) ☂️ Green
2. TONYE COLE (APC) 🏛️ Green

**Candidate Set 3 - Kano**

1. ABBA KABIR YUSUF (NNPP) ☀️ Orange
2. NASIRU YUSUF GAWUNA (APC) 🏛️ Green

---

## API Testing (Optional)

### Get all candidates

```bash
curl http://localhost:5000/api/candidates
```

### Get Lagos candidates

```bash
curl http://localhost:5000/api/candidates/Lagos
```

### Get results

```bash
curl http://localhost:5000/api/results
```

### Get Lagos results

```bash
curl http://localhost:5000/api/results/Lagos
```

---

## Next Steps

After testing these features, you can:

- Add authentication to Electoral Officer portal
- Deploy candidates to blockchain
- Integrate with physical voting hardware
- Generate reports and analytics
- Export results data

---

## Documentation

- Main docs: `README.md`
- Architecture: `ARCHITECTURE.md`
- Features detail: `ELECTORAL-FEATURES.md`
- Deployment: `DEPLOYMENT-GUIDE.md`
