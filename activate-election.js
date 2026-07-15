async function activateElection() {
  console.log("🚀 Activating election...\n");

  try {
    const res = await fetch("http://localhost:5000/api/election/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (data.success) {
      console.log("✅ Election activated successfully!");
      console.log("\n🗳️  You can now start voting!");
      console.log("   Go to: http://localhost:3000/ballot");
    } else {
      console.log("❌ Failed to activate:", data.error);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

activateElection();
