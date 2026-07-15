const testCandidates = [
  {
    name: "Ahmed Usman Bello",
    party: "APC",
    fullParty: "All Progressives Congress",
    state: "Akwa Ibom",
    logo: "🏛️",
    color: "bg-teal-600"
  },
  {
    name: "Ibrahim Musa Sheriff",
    party: "PDP",
    fullParty: "Peoples Democratic Party",
    state: "Akwa Ibom",
    logo: "☂️",
    color: "bg-red-600"
  },
  {
    name: "Fatima Aliyu Dangote",
    party: "LP",
    fullParty: "Labour Party",
    state: "Akwa Ibom",
    logo: "⚒️",
    color: "bg-green-600"
  },
  {
    name: "Yakubu Tanko Ibrahim",
    party: "NNPP",
    fullParty: "New Nigeria Peoples Party",
    state: "Akwa Ibom",
    logo: "⭕",
    color: "bg-blue-600"
  }
];

async function addCandidates() {
  console.log("🗳️  Adding test candidates...\n");

  for (const candidate of testCandidates) {
    try {
      const res = await fetch("http://localhost:5000/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidate),
      });

      const data = await res.json();
      
      if (data.success) {
        console.log(`✅ Added: ${candidate.name} (${candidate.party})`);
      } else {
        console.log(`❌ Failed: ${candidate.name} - ${data.error}`);
      }
    } catch (error) {
      console.error(`❌ Error adding ${candidate.name}:`, error.message);
    }
  }

  console.log("\n✅ Done! Check http://localhost:3000/live-polls to see results");
}

addCandidates();
