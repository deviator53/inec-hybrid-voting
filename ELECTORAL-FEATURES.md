# Electoral Management Features

## Overview

This document describes the electoral officer management system and live poll results features implemented in the INEC NEVS platform.

## Electoral Officer Portal

### Location

`/electoral-officer`

### Features

#### Candidate Management

- Add new candidates with full details
- View all candidates or filter by state
- Delete candidates from the system
- Real-time synchronization with database

#### Candidate Details

Each candidate includes:

- Full name (uppercase format)
- Party code (e.g., APC, PDP)
- Full party name
- State assignment
- Party logo (emoji selector)
- Party color (visual identifier)

#### State Filtering

- Filter candidates by Nigerian states
- View all candidates across all states
- Real-time count of candidates per filter

### Access

Navigate to: `http://localhost:3000/electoral-officer`

---

## Live Poll Results Dashboard

### Location

`/live-polls`

### Features

#### Real-Time Updates

- WebSocket connection for live vote updates
- Auto-refresh every 5 seconds (can be toggled)
- Manual refresh button
- Connection status indicator

#### View Modes

**Chart View**

- Visual bar chart representation
- Progress bars showing vote percentages
- Candidate logos and party colors
- Leader highlighted with crown icon

**Table View**

- Detailed tabular data
- Sortable by votes (descending)
- Rank, candidate, party, state, votes, percentage
- Professional data presentation

#### State Filtering

- Filter results by state
- Shows state-specific vote counts
- Updates total votes for selected state
- "All States" option for national view

#### Statistics Display

- Total votes cast
- Number of candidates
- Current blockchain block number
- Last update timestamp

#### Winner Announcement

- Highlighted leader card
- Current vote count and percentage
- Gold/yellow theme for winner display
- Updates in real-time as votes come in

### API Endpoints Used

```
GET /api/results
GET /api/results/:state
```

### Access

Navigate to: `http://localhost:3000/live-polls`

Or click "📊 View Live Results" button on homepage.

---

## Backend API Enhancements

### New Endpoints

#### Get Results by State

```typescript
GET /api/results/:state

Response:
{
  success: true,
  results: [...],
  totalVotes: "123",
  blockNumber: 456,
  state: "Lagos"
}
```

#### Enhanced Results Endpoint

The `/api/results` endpoint now includes:

- Candidate logos from database
- Party colors
- State information
- Enriched candidate data

### WebSocket Events

#### voteCast Event

Emitted when a new vote is cast on blockchain:

```typescript
{
  candidateId: "1",
  party: "APC",
  timestamp: "1640000000",
  blockNumber: "123"
}
```

---

## User Flows

### Electoral Officer Workflow

1. Navigate to Electoral Officer portal
2. Click "Add New Candidate"
3. Fill in candidate details
4. Select logo and color
5. Submit to add to database
6. View/filter candidates as needed
7. Delete candidates if necessary

### Public Viewing Workflow

1. Navigate to Live Polls page
2. Optionally filter by state
3. Toggle between Chart and Table views
4. Watch results update in real-time
5. See winner announcement (if votes > 0)

---

## Technical Details

### Frontend Stack

- Next.js 14 (App Router)
- React with TypeScript
- Tailwind CSS for styling
- Socket.IO client for WebSocket

### Backend Stack

- Express.js with TypeScript
- MongoDB for candidate/vote storage
- Socket.IO server for real-time events
- Ethers.js for blockchain interaction

### Data Flow

1. Votes cast → Blockchain (immutable)
2. VoteCast event emitted
3. Backend saves to MongoDB
4. WebSocket broadcasts to all clients
5. Frontend updates displays

---

## Security Features

- All votes stored immutably on blockchain
- Cryptographic voter hashing
- No PII exposed in results
- Read-only public results page
- Protected electoral officer functions

---

## Future Enhancements

- [ ] Authentication for electoral officer portal
- [ ] Multi-level access control (state, LGA, ward)
- [ ] Export results to PDF/CSV
- [ ] Historical results comparison
- [ ] Candidate photo uploads
- [ ] Multi-position elections
- [ ] Real-time turnout statistics
- [ ] Geographic heat maps

---

## Testing

### Electoral Officer Portal

1. Add a test candidate
2. Verify it appears in the list
3. Filter by state
4. Delete the test candidate

### Live Results

1. Cast votes via the ballot page
2. Check live-polls page updates automatically
3. Test state filtering
4. Toggle between chart/table views
5. Verify WebSocket connection status

---

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (responsive design)

---

## Support

For issues or questions, check the main project documentation or contact the development team.
