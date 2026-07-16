"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { getAllStateNames } from "@/data/nigeriaData";
import Navigation from "@/components/Navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Candidate {
  id: number;
  name: string;
  party: string;
  votes: string;
  logo?: string;
  color?: string;
  state?: string;
}

interface ResultsData {
  success?: boolean;
  results: Candidate[];
  totalVotes: string;
  blockNumber: number;
  state?: string;
}

export default function LivePollsPage() {
  const [results, setResults] = useState<Candidate[]>([]);
  const [totalVotes, setTotalVotes] = useState("0");
  const [blockNumber, setBlockNumber] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  useEffect(() => {
    const allStates = getAllStateNames();
    setStates(allStates);
  }, []);

  useEffect(() => {
    fetchResults();

    const newSocket = io(API_URL);

    newSocket.on("connect", () => {
      console.log("Connected to live updates");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from live updates");
      setIsConnected(false);
    });

    newSocket.on("voteCast", (data) => {
      console.log("New vote cast:", data);
      fetchResults();
    });

    setSocket(newSocket);

    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchResults();
      }
    }, 5000);

    return () => {
      newSocket.close();
      clearInterval(interval);
    };
  }, [autoRefresh, selectedState]);

  const fetchResults = async () => {
    try {
      const url = selectedState
        ? `${API_URL}/api/results/${selectedState}`
        : `${API_URL}/api/results`;
      const res = await fetch(url);
      const data: ResultsData = await res.json();

      if (data.success) {
        setResults(data.results);
        setTotalVotes(data.totalVotes);
        setBlockNumber(data.blockNumber);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Failed to fetch results:", error);
    }
  };

  const calculatePercentage = (votes: string): number => {
    const total = parseInt(totalVotes);
    if (total === 0) return 0;
    return (parseInt(votes) / total) * 100;
  };

  const getWinner = (): Candidate | null => {
    if (results.length === 0) return null;
    return results.reduce((prev, current) =>
      parseInt(current.votes) > parseInt(prev.votes) ? current : prev,
    );
  };

  const winner = getWinner();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <Navigation />
      <div className="bg-inec-primary border-b-4 border-yellow-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center">
                <span className="text-3xl">📊</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-2xl">INEC - NEVS</h1>
                <p className="text-green-300 text-sm">
                  Live Election Results Dashboard
                  {selectedState && ` - ${selectedState}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
              >
                <option value="" className="text-gray-800">
                  All States
                </option>
                {states.map((state) => (
                  <option key={state} value={state} className="text-gray-800">
                    {state}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
                ></div>
                <span className="text-white text-sm font-medium">
                  {isConnected ? "Live" : "Offline"}
                </span>
              </div>

              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                  autoRefresh
                    ? "bg-yellow-500 text-gray-800"
                    : "bg-white/10 text-white"
                }`}
              >
                {autoRefresh ? "🔄 Auto" : "⏸️ Manual"}
              </button>

              <button
                onClick={fetchResults}
                className="px-3 py-2 bg-white text-inec-primary font-medium rounded-lg hover:bg-gray-100 transition-all text-sm"
              >
                🔄 Refresh
              </button>

              <div className="flex bg-white/10 rounded-lg">
                <button
                  onClick={() => setViewMode("chart")}
                  className={`px-3 py-2 rounded-l-lg text-sm font-medium transition-all ${
                    viewMode === "chart"
                      ? "bg-white text-inec-primary"
                      : "text-white"
                  }`}
                >
                  📊 Chart
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-2 rounded-r-lg text-sm font-medium transition-all ${
                    viewMode === "table"
                      ? "bg-white text-inec-primary"
                      : "text-white"
                  }`}
                >
                  📋 Table
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🗳️</span>
              <h3 className="text-sm font-medium text-gray-600">
                Total Votes Cast
              </h3>
            </div>
            <p className="text-4xl font-bold text-inec-primary">
              {totalVotes.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">👥</span>
              <h3 className="text-sm font-medium text-gray-600">Candidates</h3>
            </div>
            <p className="text-4xl font-bold text-gray-800">{results.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">⛓️</span>
              <h3 className="text-sm font-medium text-gray-600">
                Block Number
              </h3>
            </div>
            <p className="text-4xl font-bold text-gray-800">#{blockNumber}</p>
          </div>
        </div>

        {winner && parseInt(totalVotes) > 0 && (
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl shadow-2xl p-8 mb-8 border-4 border-yellow-700">
            <div className="text-center">
              <p className="text-white text-sm font-bold uppercase tracking-wider mb-2">
                🏆 Current Leader 🏆
              </p>
              <h2 className="text-white text-4xl font-bold mb-2">
                {winner.name}
              </h2>
              <p className="text-yellow-100 text-xl font-semibold mb-3">
                {winner.party}
              </p>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-8 py-3 rounded-full">
                <span className="text-white text-3xl font-bold">
                  {winner.votes.toLocaleString()} votes (
                  {calculatePercentage(winner.votes).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {viewMode === "chart" ? "Live Results" : "Detailed Results Table"}
            </h2>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">🗳️</span>
              <p className="text-xl text-gray-400 font-medium">
                No votes recorded yet
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Results will appear here as votes are cast
              </p>
            </div>
          ) : viewMode === "chart" ? (
            <div className="space-y-6">
              {results
                .sort((a, b) => parseInt(b.votes) - parseInt(a.votes))
                .map((candidate, index) => {
                  const percentage = calculatePercentage(candidate.votes);
                  const isLeader = winner && candidate.id === winner.id;

                  return (
                    <div
                      key={candidate.id}
                      className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                        isLeader
                          ? "border-yellow-500 bg-yellow-50 shadow-lg"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 transition-all duration-500 ${
                          isLeader ? "bg-yellow-200" : "bg-green-100"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>

                      <div className="relative p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                              isLeader
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {index + 1}
                          </div>

                          <div className="w-16 h-16 bg-gray-100 border-2 border-gray-300 rounded flex items-center justify-center">
                            <span className="text-3xl">
                              {candidate.logo || "🏛️"}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                              {candidate.name}
                              {isLeader && (
                                <span className="text-yellow-600">👑</span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium">
                              {candidate.party}
                            </p>
                            {candidate.state && (
                              <p className="text-xs text-gray-500 mt-1">
                                📍 {candidate.state}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-3xl font-bold text-gray-800">
                            {candidate.votes.toLocaleString()}
                          </p>
                          <p className="text-sm font-semibold text-gray-600">
                            {percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-4 font-bold text-gray-700">
                      Rank
                    </th>
                    <th className="text-left p-4 font-bold text-gray-700">
                      Candidate
                    </th>
                    <th className="text-left p-4 font-bold text-gray-700">
                      Party
                    </th>
                    <th className="text-left p-4 font-bold text-gray-700">
                      State
                    </th>
                    <th className="text-right p-4 font-bold text-gray-700">
                      Votes
                    </th>
                    <th className="text-right p-4 font-bold text-gray-700">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results
                    .sort((a, b) => parseInt(b.votes) - parseInt(a.votes))
                    .map((candidate, index) => {
                      const percentage = calculatePercentage(candidate.votes);
                      const isLeader = winner && candidate.id === winner.id;

                      return (
                        <tr
                          key={candidate.id}
                          className={`border-b border-gray-100 hover:bg-gray-50 ${
                            isLeader ? "bg-yellow-50" : ""
                          }`}
                        >
                          <td className="p-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                isLeader
                                  ? "bg-yellow-500 text-white"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {index + 1}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {candidate.logo || "🏛️"}
                              </span>
                              <span className="font-semibold text-gray-800">
                                {candidate.name}
                                {isLeader && " 👑"}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-block px-3 py-1 ${candidate.color || "bg-gray-600"} text-white text-sm font-bold rounded`}
                            >
                              {candidate.party}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">
                            {candidate.state || "N/A"}
                          </td>
                          <td className="p-4 text-right font-bold text-lg text-gray-800">
                            {candidate.votes.toLocaleString()}
                          </td>
                          <td className="p-4 text-right font-semibold text-gray-600">
                            {percentage.toFixed(2)}%
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="mb-2">
            🔐 Results are cryptographically secured on the blockchain
          </p>
          <p>All votes are immutable, transparent, and verifiable</p>
        </div>
      </div>
    </div>
  );
}
