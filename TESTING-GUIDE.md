# Complete Testing Guide - INEC NEVS Electoral Features

## Prerequisites

Ensure all services are running:

```bash
START-ALL-SERVICES.bat
```

Verify services:

- MongoDB: Running on port 27017
- Blockchain: Running on port 8545
- Backend API: Running on port 5000
- Frontend: Running on port 3000
- Hardware Bridge: Running on port 5001

---

## Test Scenario 1: Electoral Officer - Add Candidates

### Objective

Test the electoral officer portal's ability to add, view, and delete candidates.

### Steps

1. **Navigate to Electoral Officer Portal**

   ```
   http://localhost:3000/electoral-officer
   ```

2. **Add First Candidate (Lagos - APC)**
   - Click "➕ Add New Candidate"
   - Fill in:
     - Candidate Name: `BABAJIDE SANWO-OLU`
     - State: `Lagos`
     - Party Code: `APC`
     - Full Party Name: `ALL PROGRESSIVES CONGRESS`
     - Logo: Click `🏛️`
     - Color: Click green
   - Click "Add Candidate"
   - ✅ Verify: Candidate appears in the list below

3. **Add Second Candidate (Lagos - LP)**
   - Click "➕ Add New Candidate"
   - Fill in:
     - Candidate Name: `GBADEBO RHODES-VIVOUR`
     - State: `Lagos`
     - Party Code: `LP`
     - Full Party Name: `LABOUR PARTY`
     - Logo: Click `⚒️`
     - Color: Click red
   - Click "Add Candidate"
   - ✅ Verify: Both candidates now visible

4. **Add Third Candidate (Lagos - PDP)**
   - Candidate Name: `ABDUL-AZEEZ ADEDIRAN`
   - State: `Lagos`
   - Party: `PDP` / `PEOPLES DEMOCRATIC PARTY`
   - Logo: `☂️`
   - Color: Green

5. **Test State Filtering**
   - Select "Lagos" from state dropdown
   - ✅ Verify: Shows 3 candidates
   - Select "All States"
   - ✅ Verify: Shows all candidates

6. **Test Delete Function**
   - Click "Delete" on any candidate
   - Confirm deletion
   - ✅ Verify: Candidate removed from list

### Expected Results

- All candidates added successfully
- Filtering works correctly
- Delete function removes candidates
- Candidate count updates in real-time

---

## Test Scenario 2: Complete Voting Flow

### Objective

Test the full voting process from session initialization to vote confirmation.

### Steps

#### Part A: Session Initialization

1. **Go to Homepage**

   ```
   http://localhost:3000
   ```

2. **Click "Initialize Polling Station →"**

3. **Fill in Session Details**
   - State: `Lagos`
   - LGA: `Ikeja`
   - Ward: `Ward 01`
   - Presiding Officer: `John Doe`
   - Click "INITIALIZE SESSION"

4. ✅ **Verify**: Session token displayed (e.g., NVS-1234567890-ABC123)

#### Part B: Voter Accreditation

5. **Click "PROCEED TO ACCREDITATION"**

6. **Enter Voter Details**
   - NIN: `12345678901` (11 digits)
   - Click "VERIFY VOTER"

7. **Biometric Capture (Simulated)**
   - Fingerprint: Click "Capture Fingerprint" (simulated)
   - Face: Click "Capture Face" (simulated)

8. **Click "ACCREDIT VOTER"**

9. ✅ **Verify**: Green checkmark and "PROCEED TO BALLOT" button appears

#### Part C: Ballot Casting

10. **Click "PROCEED TO BALLOT"**

11. **Review Candidates**
    - ✅ Verify: See all 3 Lagos candidates you added earlier
    - ✅ Verify: Each shows correct name, party, logo, color

12. **Select a Candidate**
    - Click on BABAJIDE SANWO-OLU (APC)

13. **Confirmation Modal**
    - ✅ Verify: Correct candidate displayed
    - ✅ Verify: Warning about immutability shown
    - Click "CAST BALLOT"

14. **Wait for Blockchain Confirmation**
    - Progress indicator shows
    - ✅ Verify: Success modal appears

15. **Success Screen**
    - ✅ Verify: Transaction hash displayed
    - ✅ Verify: Block number shown
    - ✅ Verify: "BALLOT CAST" message

### Expected Results

- Session created successfully
- Voter accredited without errors
- Vote recorded on blockchain
- Transaction hash and block number returned
- Cannot vote twice with same NIN

---

## Test Scenario 3: Live Results Dashboard

### Objective

Test real-time results display and filtering.

### Steps

1. **Navigate to Live Polls**

   ```
   http://localhost:3000/live-polls
   ```

2. **Verify Initial State**
   - ✅ Connection status: Green "Live" indicator
   - ✅ Auto-refresh: ON (yellow button)
   - ✅ Total votes: Should show 1 (from previous test)

3. **Check Results Display**
   - ✅ Verify: APC candidate shows 1 vote
   - ✅ Verify: Other candidates show 0 votes
   - ✅ Verify: Progress bars show correct percentages
   - ✅ Verify: APC candidate has crown icon (leader)

4. **Test State Filter**
   - Select "Lagos" from dropdown
   - ✅ Verify: Shows only Lagos candidates
   - ✅ Verify: Vote count remains accurate

5. **Test View Modes**
   - Click "📋 Table" button
   - ✅ Verify: Switches to table view
   - ✅ Verify: All data columns visible (Rank, Candidate, Party, State, Votes, Percentage)
   - Click "📊 Chart" button
   - ✅ Verify: Switches back to chart view

6. **Test Auto-Refresh**
   - Click auto-refresh to toggle OFF
   - ✅ Verify: Button changes to "⏸️ Manual"
   - Vote on another device/browser
   - ✅ Verify: Doesn't update automatically
   - Click "🔄 Refresh" button
   - ✅ Verify: Updates with new vote

7. **Cast Another Vote**
   - Open new incognito window
   - Complete voting flow (Scenario 2) with different NIN
   - Vote for LP candidate
   - Return to live polls page
   - ✅ Verify: Results update automatically (if auto-refresh ON)
   - ✅ Verify: Total votes now shows 2
   - ✅ Verify: Both candidates show their votes

### Expected Results

- Real-time updates work
- State filtering accurate
- View modes toggle correctly
- Winner announcement shows leader
- WebSocket connection stable

---

## Test Scenario 4: Multi-State Testing

### Objective

Test system with candidates from multiple states.

### Steps

1. **Add Rivers State Candidates**
   - Go to Electoral Officer portal
   - Add:
     - SIMINALAYI FUBARA (PDP)
     - TONYE COLE (APC)
   - State: `Rivers`

2. **Add Kano State Candidates**
   - Add:
     - ABBA KABIR YUSUF (NNPP)
     - NASIRU YUSUF GAWUNA (APC)
   - State: `Kano`

3. **Test Filtering**
   - Go to Live Polls
   - Filter by "Lagos"
   - ✅ Verify: Shows only Lagos results
   - Filter by "Rivers"
   - ✅ Verify: Shows only Rivers results (0 votes)
   - Filter by "All States"
   - ✅ Verify: Shows all candidates

4. **Vote from Different States**
   - Initialize new session for Rivers
   - Cast vote for Rivers candidate
   - Go to Live Polls
   - Filter by Rivers
   - ✅ Verify: Rivers results update

### Expected Results

- Multi-state data handled correctly
- Filtering works across all states
- Vote counts isolated per state
- National view shows all states combined

---

## Test Scenario 5: Error Handling

### Objective

Test system's response to error conditions.

### Steps

1. **Duplicate Vote Test**
   - Use same NIN from previous vote
   - Try to accredit again
   - ✅ Verify: Error message shown
   - ✅ Verify: Cannot proceed to ballot

2. **Invalid NIN Test**
   - Enter NIN with less than 11 digits
   - ✅ Verify: Validation error
   - Enter NIN with letters
   - ✅ Verify: Validation error

3. **No Candidates Test**
   - Initialize session for state with no candidates (e.g., Ogun)
   - Proceed to ballot
   - ✅ Verify: "No candidates available" message

4. **Backend Offline Test**
   - Stop backend service
   - Try to load Live Polls
   - ✅ Verify: "Offline" status indicator
   - Try to refresh
   - ✅ Verify: Error handled gracefully
   - Restart backend
   - ✅ Verify: Reconnects automatically

### Expected Results

- All errors caught and displayed
- No system crashes
- User-friendly error messages
- Graceful degradation

---

## Test Scenario 6: Audit Observer View

### Objective

Test the blockchain monitoring interface.

### Steps

1. **Navigate to Audit Observer**

   ```
   http://localhost:3000/audit-observer
   ```

2. **Verify Dashboard Elements**
   - ✅ Blockchain pulse stream visible
   - ✅ Live tally showing results
   - ✅ Block height updating
   - ✅ Connection status: "LIVE"

3. **Cast Votes and Monitor**
   - Cast a vote from ballot page
   - Watch Audit Observer
   - ✅ Verify: New transaction appears in feed
   - ✅ Verify: Vote count updates
   - ✅ Verify: Block height increments

4. **Check Statistics**
   - ✅ Total votes recorded matches
   - ✅ Integrity score displayed
   - ✅ Blockchain stats visible

### Expected Results

- Real-time blockchain monitoring works
- Transaction feed updates live
- Statistics accurate
- Professional audit interface

---

## Performance Testing

### Load Test

1. **Multiple Rapid Votes**
   - Open 5-10 browser tabs
   - Cast votes from different NIPs simultaneously
   - Monitor Live Polls
   - ✅ Verify: All votes recorded
   - ✅ Verify: No vote loss
   - ✅ Verify: Counts accurate

2. **Continuous Refresh**
   - Keep Live Polls open for 5 minutes
   - Cast votes intermittently
   - ✅ Verify: No memory leaks
   - ✅ Verify: Updates remain smooth
   - ✅ Verify: WebSocket stays connected

### Expected Results

- System handles concurrent votes
- No data corruption
- Performance remains stable

---

## Browser Compatibility

Test on:

- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Firefox
- ✅ Safari (if available)
- ✅ Mobile browsers (responsive design)

---

## API Testing (Optional)

### Test with cURL or Postman

```bash
# Get all candidates
curl http://localhost:5000/api/candidates

# Get Lagos candidates
curl http://localhost:5000/api/candidates/Lagos

# Get all results
curl http://localhost:5000/api/results

# Get Lagos results
curl http://localhost:5000/api/results/Lagos

# Health check
curl http://localhost:5000/health
```

---

## Cleanup After Testing

1. **Clear Database** (if needed)
   - Stop all services
   - Open MongoDB Compass or mongosh
   - Connect to `mongodb://localhost:27017/inec_voting`
   - Drop collections: candidates, voters, votes, sessions

2. **Reset Blockchain** (if needed)
   - Stop blockchain
   - Delete `blockchain/artifacts` and `blockchain/cache`
   - Run deployment again

---

## Common Issues & Solutions

### Issue: Candidates not loading on ballot

**Solution**: Ensure state in session matches state of candidates

### Issue: Vote not appearing in results

**Solution**: Check blockchain deployment, verify contract loaded in backend logs

### Issue: WebSocket disconnected

**Solution**: Restart backend service, check port 5000 not blocked

### Issue: "Duplicate vote" error

**Solution**: Expected behavior - use different NIN for testing

### Issue: No candidates for state

**Solution**: Add candidates via Electoral Officer portal first

---

## Success Criteria

All tests pass when:

- ✅ Candidates can be added, viewed, and deleted
- ✅ Complete voting flow works end-to-end
- ✅ Votes record on blockchain with transaction hash
- ✅ Live results update in real-time
- ✅ State filtering works correctly
- ✅ Multiple view modes function properly
- ✅ Error handling prevents crashes
- ✅ Duplicate votes blocked
- ✅ Audit observer shows blockchain activity
- ✅ System handles concurrent operations

---

## Reporting Issues

Document any issues found:

1. Steps to reproduce
2. Expected vs actual result
3. Screenshots/error messages
4. Browser and OS version
5. Console errors (F12 → Console tab)

---

## Next Steps After Testing

- Deploy to staging environment
- Conduct security audit
- Add authentication layer
- Implement rate limiting
- Set up monitoring and alerting
- Prepare for production deployment
