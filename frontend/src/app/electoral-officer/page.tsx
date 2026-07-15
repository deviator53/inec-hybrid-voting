"use client";

import { useState, useEffect } from "react";
import { getAllStateNames } from "@/data/nigeriaData";
import Navigation from "@/components/Navigation";

interface Candidate {
  _id: string;
  name: string;
  party: string;
  fullParty: string;
  state: string;
  logo: string;
  color: string;
}

export default function ElectoralOfficerPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [electionActive, setElectionActive] = useState(false);
  const [electionStats, setElectionStats] = useState({
    totalVotes: "0",
    candidateCount: "0",
  });

  const [formData, setFormData] = useState({
    name: "",
    party: "",
    fullParty: "",
    state: "",
    logo: "🏛️",
    color: "bg-gray-600",
  });

  const partyColors = [
    { label: "Teal", value: "bg-teal-600" },
    { label: "Red", value: "bg-red-600" },
    { label: "Green", value: "bg-green-600" },
    { label: "Blue", value: "bg-blue-600" },
    { label: "Orange", value: "bg-orange-600" },
    { label: "Purple", value: "bg-purple-600" },
  ];

  const emojiOptions = ["🏛️", "☂️", "⚒️", "⭕", "☀️", "⚡", "⚖️"];

  useEffect(() => {
    const allStates = getAllStateNames();
    setStates(allStates);
    fetchCandidates();
    fetchElectionStatus();
  }, []);

  const fetchCandidates = async (state?: string) => {
    try {
      const url = state
        ? `http://localhost:5000/api/candidates/${state}`
        : "http://localhost:5000/api/candidates";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setCandidates(data.candidates);
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    }
  };

  const fetchElectionStatus = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/election/status");
      const data = await res.json();
      if (data.success) {
        setElectionActive(data.isActive);
        setElectionStats({
          totalVotes: data.totalVotes,
          candidateCount: data.candidateCount,
        });
      }
    } catch (error) {
      console.error("Failed to fetch election status:", error);
    }
  };

  const handleActivateElection = async () => {
    if (
      !confirm(
        "Are you sure you want to activate the election? This cannot be undone!",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/election/activate", {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Election activated successfully! Voting can now begin.");
        fetchElectionStatus();
      } else {
        alert("❌ Failed to activate election: " + data.error);
      }
    } catch (error) {
      console.error("Failed to activate election:", error);
      alert("❌ Failed to activate election");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateElection = async () => {
    if (
      !confirm(
        "Are you sure you want to deactivate the election? Voting will be stopped.",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/election/deactivate", {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Election deactivated successfully!");
        fetchElectionStatus();
      } else {
        alert("❌ Failed to deactivate election: " + data.error);
      }
    } catch (error) {
      console.error("Failed to deactivate election:", error);
      alert("❌ Failed to deactivate election");
    } finally {
      setLoading(false);
    }
  };

  const handleStateFilter = (state: string) => {
    setSelectedState(state);
    if (state) {
      fetchCandidates(state);
    } else {
      fetchCandidates();
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddForm(false);
        setFormData({
          name: "",
          party: "",
          fullParty: "",
          state: "",
          logo: "🏛️",
          color: "bg-gray-600",
        });
        fetchCandidates(selectedState);
      }
    } catch (error) {
      console.error("Failed to add candidate:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this candidate?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/candidates/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchCandidates(selectedState);
      }
    } catch (error) {
      console.error("Failed to delete candidate:", error);
    }
  };

  return (
    <div className="min-h-screen bg-ballot-cream">
      <Navigation />
      <div className="bg-inec-primary border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => (window.location.href = "/")}
              >
                <span className="text-xl">⚖️</span>
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">
                  INEC - NEVS
                </h1>
                <p className="text-green-300 text-sm">
                  Electoral Officer Portal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => (window.location.href = "/live-polls")}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-800 font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <span>📊</span>
                View Live Results
              </button>
              <div className="px-4 py-2 bg-white/10 rounded flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  👨‍💼 ELECTORAL OFFICER
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Election Status Banner */}
        <div
          className={`rounded-lg shadow border-2 p-6 mb-6 ${
            electionActive
              ? "bg-green-50 border-green-500"
              : "bg-yellow-50 border-yellow-500"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  electionActive ? "bg-green-500" : "bg-yellow-500"
                }`}
              >
                <span className="text-3xl">{electionActive ? "✅" : "⏸️"}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Election Status: {electionActive ? "ACTIVE" : "NOT ACTIVE"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {electionActive
                    ? "Voting is currently in progress. Candidates cannot be modified."
                    : "Add candidates and activate the election to begin voting."}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
                  <span>📊 Candidates: {electionStats.candidateCount}</span>
                  <span>🗳️ Total Votes: {electionStats.totalVotes}</span>
                </div>
              </div>
            </div>
            {!electionActive && candidates.length > 0 && (
              <button
                onClick={handleActivateElection}
                disabled={loading}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all disabled:bg-gray-400 flex items-center gap-2"
              >
                <span>🚀</span>
                {loading ? "Activating..." : "Activate Election"}
              </button>
            )}
            {electionActive && (
              <button
                onClick={handleDeactivateElection}
                disabled={loading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all disabled:bg-gray-400 flex items-center gap-2"
              >
                <span>⏸️</span>
                {loading ? "Deactivating..." : "Deactivate Election"}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Candidate Management
              </h2>
              <p className="text-sm text-gray-600">
                Add, view, and manage candidates for each state
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              disabled={electionActive}
              className="px-6 py-3 bg-inec-primary hover:bg-inec-medium text-white font-semibold rounded-lg transition-all flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <span>➕</span>
              Add New Candidate
            </button>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Filter by State:
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-inec-primary focus:outline-none"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600">
              {candidates.length} candidate(s) found
            </span>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Add New Candidate
            </h3>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Candidate Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-inec-primary focus:outline-none"
                    placeholder="JOHN DOE SMITH"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-inec-primary focus:outline-none"
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party Code *
                  </label>
                  <input
                    type="text"
                    value={formData.party}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        party: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-inec-primary focus:outline-none"
                    placeholder="APC"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Party Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullParty}
                    onChange={(e) =>
                      setFormData({ ...formData, fullParty: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-inec-primary focus:outline-none"
                    placeholder="ALL PROGRESSIVES CONGRESS"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo
                  </label>
                  <div className="flex gap-2">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, logo: emoji })
                        }
                        className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-2xl ${
                          formData.logo === emoji
                            ? "border-inec-primary bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party Color
                  </label>
                  <div className="flex gap-2">
                    {partyColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, color: color.value })
                        }
                        className={`w-12 h-12 ${color.value} rounded-lg border-2 ${
                          formData.color === color.value
                            ? "border-gray-800 scale-110"
                            : "border-transparent"
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all disabled:bg-gray-400"
                >
                  {loading ? "Adding..." : "Add Candidate"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {selectedState
              ? `Candidates for ${selectedState}`
              : "All Candidates"}
          </h3>

          {candidates.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No candidates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate._id}
                  className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-inec-primary transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 border-2 border-gray-300 rounded flex items-center justify-center">
                      <span className="text-3xl">{candidate.logo}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">
                        {candidate.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {candidate.fullParty}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-block px-2 py-1 ${candidate.color} text-white text-xs font-bold rounded`}
                        >
                          {candidate.party}
                        </span>
                        <span className="text-xs text-gray-500">
                          📍 {candidate.state}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCandidate(candidate._id)}
                    disabled={electionActive}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
