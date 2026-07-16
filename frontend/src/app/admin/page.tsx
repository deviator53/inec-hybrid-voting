"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ElectionStatus {
  success: boolean;
  isActive: boolean;
  totalVotes: string;
  candidateCount: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [electionStatus, setElectionStatus] = useState<ElectionStatus | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [activating, setActivating] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchElectionStatus();
    const interval = setInterval(fetchElectionStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchElectionStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/election/status`);
      const data = await res.json();

      if (data.success) {
        setElectionStatus(data);
      } else {
        setMessage({
          text: data.error || "Failed to fetch election status",
          type: "error",
        });
      }
    } catch (error: any) {
      setMessage({
        text: error.message || "Failed to connect to backend",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const activateElection = async () => {
    if (
      !confirm(
        "Are you sure you want to activate the election? This will allow votes to be cast.",
      )
    ) {
      return;
    }

    try {
      setActivating(true);
      setMessage(null);

      const res = await fetch(`${API_URL}/api/election/activate`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        setMessage({
          text: "Election activated successfully!",
          type: "success",
        });
        fetchElectionStatus();
      } else {
        setMessage({
          text: data.error || "Failed to activate election",
          type: "error",
        });
      }
    } catch (error: any) {
      setMessage({
        text: error.message || "Failed to activate election",
        type: "error",
      });
    } finally {
      setActivating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <div className="bg-inec-primary border-b-4 border-yellow-500 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">
                INEC - NEVS Admin
              </h1>
              <p className="text-green-300 text-sm">Election Control Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/electoral-officer")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm"
            >
              👨‍💼 Electoral Officer
            </button>
            <button
              onClick={() => router.push("/live-polls")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all text-sm"
            >
              📊 Live Results
            </button>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-800 font-semibold rounded-lg transition-all text-sm"
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border-2 ${
              message.type === "success"
                ? "bg-green-50 border-green-300 text-green-800"
                : "bg-red-50 border-red-300 text-red-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {message.type === "success" ? "✅" : "❌"}
              </span>
              <p className="font-medium">{message.text}</p>
              <button
                onClick={() => setMessage(null)}
                className="ml-auto text-xl leading-none opacity-60 hover:opacity-100"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Status Overview */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Election Status
              </h2>
              <button
                onClick={fetchElectionStatus}
                disabled={loading}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all text-sm disabled:opacity-50"
              >
                {loading ? "⏳" : "🔄"} Refresh
              </button>
            </div>

            {loading && !electionStatus ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-inec-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading election status...</p>
              </div>
            ) : electionStatus ? (
              <div className="space-y-4">
                <div
                  className={`p-6 rounded-xl border-2 ${
                    electionStatus.isActive
                      ? "bg-green-50 border-green-300"
                      : "bg-red-50 border-red-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-semibold text-lg">
                      Election Status
                    </span>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full animate-pulse ${
                          electionStatus.isActive
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span
                        className={`font-bold text-xl ${
                          electionStatus.isActive
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {electionStatus.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {electionStatus.isActive
                      ? "Voting is currently enabled. Voters can cast their ballots."
                      : "Voting is disabled. Activate the election to allow voting."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-sm mb-1">
                      Total Votes Cast
                    </p>
                    <p className="text-3xl font-bold text-gray-800">
                      {parseInt(electionStatus.totalVotes).toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600 text-sm mb-1">
                      Registered Candidates
                    </p>
                    <p className="text-3xl font-bold text-gray-800">
                      {electionStatus.candidateCount}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">⚠️</span>
                <p className="text-xl text-gray-600 font-medium mb-4">
                  Unable to load election status
                </p>
                <button
                  onClick={fetchElectionStatus}
                  className="px-6 py-3 bg-inec-primary hover:bg-inec-medium text-white font-semibold rounded-lg transition-all"
                >
                  🔄 Retry
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {electionStatus && !electionStatus.isActive && (
                <button
                  onClick={activateElection}
                  disabled={activating}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {activating ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Activating...
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      Activate Election
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => router.push("/electoral-officer")}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span>👨‍💼</span>
                Manage Candidates
              </button>

              <button
                onClick={() => router.push("/live-polls")}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span>📊</span>
                View Live Results
              </button>

              <button
                onClick={fetchElectionStatus}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                Refresh Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
