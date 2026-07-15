"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";

interface Candidate {
  _id: string;
  name: string;
  party: string;
  fullParty: string;
  state: string;
  logo: string;
  color: string;
  blockchainId?: number;
}

export default function BallotPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [blockNumber, setBlockNumber] = useState(0);
  const [printing, setPrinting] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentBlockHeight, setCurrentBlockHeight] = useState<number | null>(
    null,
  );
  const [ward, setWard] = useState("");
  const [lga, setLga] = useState("");
  const [state, setState] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const showToast = (message: string, type: "error" | "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    // Load session data
    const wardData = localStorage.getItem("ward") || "";
    const lgaData = localStorage.getItem("lga") || "";
    const stateData = localStorage.getItem("state") || "";

    setWard(wardData);
    setLga(lgaData);
    setState(stateData);

    // Fetch candidates for the state
    if (stateData) {
      fetchCandidates(stateData);
    }

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);

    // Fetch blockchain stats
    const fetchBlockchain = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/blockchain/stats");
        const data = await res.json();
        if (data.success) {
          setCurrentBlockHeight(data.blockNumber);
        }
      } catch (error) {
        console.error("Failed to fetch blockchain stats:", error);
      }
    };

    fetchBlockchain();
    const blockInterval = setInterval(fetchBlockchain, 10000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(blockInterval);
    };
  }, []);

  const fetchCandidates = async (state: string) => {
    try {
      setLoadingCandidates(true);
      const res = await fetch(`http://localhost:5000/api/candidates/${state}`);
      const data = await res.json();
      if (data.success && data.candidates) {
        setCandidates(data.candidates);
      } else {
        showToast("No candidates found for this state", "error");
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      showToast("Failed to load candidates", "error");
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleCandidateSelect = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowConfirmation(true);
  };

  const handleGoBack = () => {
    setShowConfirmation(false);
    setSelectedCandidate(null);
  };

  const handleCastBallot = async () => {
    try {
      const voterHash = localStorage.getItem("voterHash");
      const sessionToken = localStorage.getItem("sessionToken");

      // Find the candidate index (1-based) for blockchain
      const candidateIndex =
        candidates.findIndex((c) => c._id === selectedCandidate._id) + 1;

      const res = await fetch("http://localhost:5000/api/vote/cast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidateIndex,
          voterHash,
          sessionId: sessionToken,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTransactionHash(data.transactionHash);
        setBlockNumber(data.blockNumber);
        setShowConfirmation(false);
        setShowSuccess(true);

        // Trigger printer
        setPrinting(true);
        await fetch("http://localhost:5050/api/printer/print-receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionHash: data.transactionHash,
            candidate: selectedCandidate.name,
            party: selectedCandidate.party,
            blockNumber: data.blockNumber,
          }),
        });

        setTimeout(() => setPrinting(false), 3000);
      } else {
        // Show error toast
        setShowConfirmation(false);
        showToast(data.error || "Failed to cast vote", "error");
      }
    } catch (error: any) {
      console.error("Vote casting failed:", error);
      setShowConfirmation(false);
      showToast(
        error.message || "Failed to cast vote. Please try again.",
        "error",
      );
    }
  };

  return (
    <div className="min-h-screen bg-ballot-cream">
      <Navigation />
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in">
          <div
            className={`${
              toast.type === "error"
                ? "bg-red-600 border-red-700"
                : "bg-green-600 border-green-700"
            } border-2 text-white px-6 py-4 rounded-lg shadow-2xl flex items-start gap-3 max-w-md`}
          >
            <span className="text-2xl">
              {toast.type === "error" ? "⚠️" : "✓"}
            </span>
            <div className="flex-1">
              <p className="font-semibold mb-1">
                {toast.type === "error" ? "Error" : "Success"}
              </p>
              <p className="text-sm">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-white hover:text-gray-200 text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-inec-primary border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center">
              <span className="text-xl">⚖️</span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">INEC - NEVS</h1>
              <p className="text-green-300 text-sm">
                National Electronic Voting System
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-green-300 text-xs uppercase">Terminal ID</p>
              <p className="text-white text-sm font-mono">THM-NIG-2025-04712</p>
            </div>
            <div>
              <p className="text-green-300 text-xs uppercase">Ward ID</p>
              <p className="text-white text-sm font-mono">04/12/08/2001</p>
            </div>
            <div className="px-3 py-1 bg-green-600 rounded flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="text-white text-sm font-semibold">
                BLOCKCHAIN: LINKED
              </span>
            </div>
            <div>
              <p className="text-green-300 text-xs uppercase">Block Height</p>
              <p className="text-white text-sm font-mono">
                {currentBlockHeight !== null
                  ? currentBlockHeight.toLocaleString()
                  : "Loading..."}
              </p>
            </div>
            <span className="text-white text-sm font-mono">{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Election Info Banner */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">📋</span>
            <div>
              <p className="text-xs text-gray-500 uppercase">
                Election: GUBERNATORIAL_2025
              </p>
              <p className="text-sm font-semibold text-gray-800">
                WARD:{" "}
                {ward && lga && state
                  ? `${ward} - ${lga} - ${state}`
                  : "Loading..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
              ⚡ SESSION ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Main Ballot */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-full mb-6">
            <span className="text-green-600">✓</span>
            <span className="text-xs text-gray-600 uppercase tracking-wide">
              OFFICIAL DIGITAL BALLOT PAPER - REF: N5R-50V-2025-0001
            </span>
          </div>
          <h1 className="text-4xl text-gray-800 font-light mb-3 tracking-wide">
            TOUCH YOUR CHOICE
          </h1>
          <p className="text-gray-600">
            Select one candidate below. You will be asked to confirm your choice
            before your vote is cast.
          </p>
        </div>

        {/* Ballot Card */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-300 p-8 mb-8">
          <div className="border-b border-gray-300 pb-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 uppercase">
              GOVERNORSHIP ELECTION —{" "}
              {state ? state.toUpperCase() : "LOADING..."}
            </h2>
            <p className="text-sm text-gray-600">
              Cast your vote for ONE (1) candidate only. Your vote is secret and
              secure.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">👥</span>
              <span className="text-xs text-gray-600">
                {candidates.length} CANDIDATES
              </span>
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-2 gap-4">
            {loadingCandidates ? (
              <div className="col-span-2 text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-inec-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading candidates...</p>
              </div>
            ) : candidates.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <span className="text-6xl mb-4 block">📋</span>
                <p className="text-xl text-gray-600 font-semibold mb-2">
                  No Candidates Available
                </p>
                <p className="text-sm text-gray-500">
                  No candidates have been registered for {state || "this state"}{" "}
                  yet.
                </p>
              </div>
            ) : (
              candidates.map((candidate, index) => (
                <button
                  key={candidate._id}
                  onClick={() => handleCandidateSelect(candidate)}
                  className="text-left p-6 border-2 border-gray-300 hover:border-inec-primary hover:shadow-lg transition-all rounded bg-ballot-tan hover:bg-white group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white border-2 border-gray-300 rounded flex flex-col items-center justify-center">
                      <span className="text-3xl mb-1">{candidate.logo}</span>
                      <span className="text-xs text-gray-500 uppercase text-center px-1">
                        {candidate.party}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Governorship Candidate
                      </p>
                      <span
                        className={`inline-block px-3 py-1 ${candidate.color} text-white text-xs font-bold rounded`}
                      >
                        {candidate.party}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>
              BALLOT HASH: 7F34DC2D - NEVS v4.2.1 · UDQCER 27001 Certified
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">🔒</span>
            <span>END-TO-END ENCRYPTED · TLS 1.3</span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></span>
          Unauthorized access to this system is a criminal offense under the
          Electoral Act 2022 and the Cybercrimes (Prohibition, Prevention, etc.)
          Act 2015
        </p>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6">
          <div className="bg-gradient-to-b from-inec-primary to-inec-medium rounded-lg shadow-2xl max-w-2xl w-full p-1">
            <div className="bg-white rounded-lg p-8">
              <div className="text-center mb-6">
                <div className="h-1 bg-yellow-500 w-full mb-4"></div>
                <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                  VERIFY YOUR SELECTION
                </p>
                <h2 className="text-2xl font-bold text-gray-800">
                  CONFIRM YOUR VOTE
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Please review carefully. This action cannot be undone.
                </p>
              </div>

              <div className="bg-ballot-tan border-2 border-yellow-400 rounded-lg p-6 mb-6">
                <p className="text-xs text-gray-600 mb-3 uppercase">
                  YOU HAVE SELECTED:
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white border-2 border-gray-300 rounded flex items-center justify-center">
                    <span className="text-3xl">{selectedCandidate.logo}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {selectedCandidate.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedCandidate.fullParty}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-block px-4 py-2 ${selectedCandidate.color} text-white font-bold rounded`}
                >
                  {selectedCandidate.party}
                </span>
                <p className="text-xs text-gray-600 mt-4">
                  🏛️ Governorship Election - {state || "Loading..."} 2025
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <p className="text-sm text-gray-700">
                    Once you press <strong>"CAST BALLOT"</strong>, your vote
                    will be permanently recorded on the blockchain and cannot be
                    changed or recalled.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleGoBack}
                  className="py-4 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  ← GO BACK
                </button>
                <button
                  onClick={handleCastBallot}
                  className="py-4 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>🗳️</span>
                  CAST BALLOT
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  BLOCKCHAIN: LINKED - HEIGHT{" "}
                  {currentBlockHeight !== null
                    ? currentBlockHeight.toLocaleString()
                    : "..."}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  SESSION: NVS-2025-N5R-4FTA
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-inec-primary bg-opacity-95 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <span className="text-gray-600 text-xl leading-none">×</span>
            </button>

            <div className="text-center mb-8">
              <div className="h-1 bg-yellow-500 w-full mb-6"></div>
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-white">✓</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                BALLOT CAST
              </h2>
              <p className="text-gray-600">
                Your vote has been securely recorded.
              </p>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <p className="text-xs text-gray-600 mb-3 uppercase">
                TRANSACTION HASH
              </p>
              <p className="font-mono text-lg text-gray-800 break-all mb-4">
                {transactionHash}
              </p>
              <div className="flex items-center justify-center gap-2 text-green-700">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="font-semibold">
                  CONFIRMED ON BLOCKCHAIN · BLOCK {blockNumber.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 mb-6">
              Please collect your printed receipt from the thermal printer.
              Thank you for participating in Nigeria's democratic process.
            </p>

            {printing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl animate-pulse">🖨️</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      Receipt Printing...
                    </p>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-green-500 animate-pulse"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
