"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import Navigation from "@/components/Navigation";

export default function AuditObserverPage() {
  const [results, setResults] = useState<any[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [blockHeight, setBlockHeight] = useState(842426);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [stats, setStats] = useState({
    blocksPerMinute: 4.7,
    validationRate: 99.5,
    nodePeers: 14,
    avgBlockTime: 14.2,
  });
  const [ward, setWard] = useState("");
  const [lga, setLga] = useState("");
  const [state, setState] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Load session data
    setWard(localStorage.getItem("ward") || "");
    setLga(localStorage.getItem("lga") || "");
    setState(localStorage.getItem("state") || "");

    // Update time
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);

    fetchResults();

    // Connect to WebSocket
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("voteCast", (data) => {
      console.log("New vote cast:", data);
      setRecentTransactions((prev) => [data, ...prev].slice(0, 6));
      fetchResults();
    });

    const interval = setInterval(() => {
      setBlockHeight((prev) => prev + Math.floor(Math.random() * 2));
    }, 12000);

    return () => {
      newSocket.close();
      clearInterval(interval);
    };
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/results");
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
        setTotalVotes(parseInt(data.totalVotes));
        setBlockHeight(data.blockNumber);
      }
    } catch (error) {
      console.error("Failed to fetch results:", error);
    }
  };

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : "0.0";
  };

  const getLeader = () => {
    if (results.length === 0) return null;
    return results.reduce(
      (max, r) => (parseInt(r.votes) > parseInt(max.votes) ? r : max),
      results[0],
    );
  };

  const leader = getLeader();

  return (
    <div className="min-h-screen bg-ballot-tan">
      <Navigation />
      {/* Header */}
      <div className="bg-inec-primary border-b-4 border-yellow-500">
        <div className="max-w-full px-6 py-4 flex items-center justify-between">
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
            <div className="px-3 py-2 rounded flex items-center gap-2 bg-yellow-500">
              <span className="text-sm font-bold text-gray-800">
                👁️ OBSERVER VIEW
              </span>
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
                {blockHeight.toLocaleString()}
              </p>
            </div>
            <span className="text-white text-sm font-mono">16:30:42</span>
          </div>
        </div>
      </div>

      {/* Election Info */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">📊</span>
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
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 uppercase">Ledger:</span>
            <span className="text-sm font-mono font-semibold text-gray-800">
              AUDIT MATRIX v2.4
            </span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-inec-pale border-b border-green-200 py-4">
        <div className="max-w-full px-6 grid grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-gray-600 uppercase mb-1">
              Total Blocks Validated
            </p>
            <p className="text-2xl font-bold text-gray-800">1,264</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase mb-1">
              Votes Recorded
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {totalVotes.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase mb-1">
              Integrity Score
            </p>
            <p className="text-2xl font-bold text-green-600">96.0%</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase mb-1">
              Last Block Time
            </p>
            <p className="text-2xl font-bold text-gray-800">15:30:23.374</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-full px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Blockchain Pulse */}
          <div className="col-span-5 bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⛓️</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    BLOCKCHAIN PULSE STREAM
                  </h2>
                  <p className="text-sm text-gray-600">Live validated blocks</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                LIVE
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-yellow-600 font-mono">
                  🟡 HEIGHT: {blockHeight.toLocaleString()}
                </span>
                <span className="text-green-600 font-mono">
                  ✓ VALIDATED: 1,256
                </span>
                <span className="text-orange-500 font-mono">⟳ PENDING: 8</span>
              </div>
            </div>

            {/* Transaction Feed */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">Waiting for votes...</p>
                </div>
              ) : (
                recentTransactions.map((tx, index) => (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-green-700">
                        #{tx.blockNumber} BLK-842
                        {Math.floor(Math.random() * 1000)}
                      </span>
                      <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
                        ✓ VALIDATED
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">HASH:</span>
                        <span className="text-xs font-mono text-gray-800">
                          0x{Math.random().toString(16).substr(2, 8)}...
                          {Math.random().toString(16).substr(2, 4)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">PREV:</span>
                        <span className="text-xs font-mono text-gray-600">
                          0x{Math.random().toString(16).substr(2, 8)}...
                          {Math.random().toString(16).substr(2, 4)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">PARTY:</span>
                        <span className="text-xs font-bold text-gray-800">
                          {tx.party} 1 vote
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date().toLocaleTimeString()} UTC
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-green-600 font-semibold uppercase">
                  CHAIN INTACT
                </span>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2 font-mono">
                LEDGER: BLK-0x0...{Math.random().toString(16).substr(2, 4)} •
                ECCDA v1.3.5
              </p>
            </div>
          </div>

          {/* Right Column - Live Tally */}
          <div className="col-span-7 bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    LIVE AGGREGATE TALLY
                  </h2>
                  <p className="text-sm text-gray-600">
                    Real-time vote count - Data: 04/12/08/2001
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-500 text-gray-800 text-xs font-bold rounded">
                🔄 SYNCING
              </span>
            </div>

            {/* Leader Info */}
            {leader && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-700 font-semibold uppercase mb-1">
                      🏆 LEADING • TOTAL VOTES: {totalVotes.toLocaleString()} •
                      TURNOUT: {((totalVotes / 3648) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {leader.party}: {leader.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 mb-1">✖ VOTES AHEAD</p>
                    <p className="text-2xl font-bold text-green-700">
                      {getPercentage(parseInt(leader.votes))}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Results Bars */}
            <div className="space-y-4">
              {results.map((result) => {
                const partyColors: any = {
                  APC: "bg-teal-600",
                  PDP: "bg-red-600",
                  LP: "bg-red-500",
                  NNPP: "bg-green-600",
                  ADC: "bg-blue-600",
                  SDP: "bg-orange-600",
                  YPP: "bg-purple-600",
                  ZLP: "bg-teal-500",
                };

                return (
                  <div key={result.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 ${partyColors[result.party] || "bg-gray-600"} text-white text-xs font-bold rounded`}
                        >
                          {result.party}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {result.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {result.party === "APC"
                              ? "All Progressives Congress"
                              : result.party === "PDP"
                                ? "Peoples Democratic Party"
                                : "Opposition Party"}
                          </p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {parseInt(result.votes).toLocaleString()}
                      </p>
                    </div>
                    <div className="relative">
                      <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${partyColors[result.party] || "bg-gray-500"} transition-all duration-500`}
                          style={{
                            width: `${getPercentage(parseInt(result.votes))}%`,
                          }}
                        ></div>
                      </div>
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-bold text-gray-700">
                        {getPercentage(parseInt(result.votes))}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 uppercase mb-1">
                  Registered Voters
                </p>
                <p className="text-lg font-bold text-gray-800">3,648</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 uppercase mb-1">
                  Accredited
                </p>
                <p className="text-lg font-bold text-gray-800">1,361</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 uppercase mb-1">
                  Votes Cast
                </p>
                <p className="text-lg font-bold text-green-600">
                  {totalVotes.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                NEVS v4.2.1 · ISSUED 27001 · TLS 1.3
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 text-center">
            <span className="text-3xl mb-3 block">⛓️</span>
            <p className="text-xs text-gray-600 uppercase mb-2">
              BLOCKS / MINUTE
            </p>
            <p className="text-3xl font-bold text-gray-800">
              {stats.blocksPerMinute}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 text-center">
            <span className="text-3xl mb-3 block">✓</span>
            <p className="text-xs text-gray-600 uppercase mb-2">
              VALIDATION RATE
            </p>
            <p className="text-3xl font-bold text-green-600">
              {stats.validationRate}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 text-center">
            <span className="text-3xl mb-3 block">🌐</span>
            <p className="text-xs text-gray-600 uppercase mb-2">NODE PEERS</p>
            <p className="text-3xl font-bold text-gray-800">
              {stats.nodePeers}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 text-center">
            <span className="text-3xl mb-3 block">⏱️</span>
            <p className="text-xs text-gray-600 uppercase mb-2">
              AVG BLOCK TIME
            </p>
            <p className="text-3xl font-bold text-gray-800">
              {stats.avgBlockTime}s
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            Real-Time Ledger Audit Matrix — Observer View Only. Unauthorized
            manipulation of this system is a criminal offense under the
            Electoral Act 2022 and the Cybercrimes Act 2015.
          </p>
        </div>
      </div>
    </div>
  );
}
