"use client";

import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-inec-primary via-inec-medium to-inec-light p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 pt-12">
          <div className="w-32 h-32 mx-auto mb-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-6xl">⚖️</span>
          </div>

          <h1 className="text-5xl text-white font-bold mb-4">INEC - NEVS</h1>
          <p className="text-2xl text-green-100 mb-2">
            National Electronic Voting System
          </p>
          <p className="text-green-200 mb-8">
            Federal Republic of Nigeria · Independent National Electoral
            Commission
          </p>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 mb-8 max-w-2xl mx-auto">
            <p className="text-white mb-6">
              Blockchain-Based Hybrid Electronic Voting System
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl mb-2">⛓️</p>
                <p className="text-sm text-green-100">Immutable</p>
              </div>
              <div>
                <p className="text-3xl mb-2">🔒</p>
                <p className="text-sm text-green-100">Secure</p>
              </div>
              <div>
                <p className="text-3xl mb-2">✓</p>
                <p className="text-sm text-green-100">Transparent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Live Results Card */}
          <div
            className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-2xl p-8 text-center transform hover:scale-105 transition-all cursor-pointer border-4 border-yellow-700"
            onClick={() => router.push("/live-polls")}
          >
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-white mb-3">Live Results</h2>
            <p className="text-yellow-100 mb-6 text-sm">
              Watch election results update in real-time as votes are cast
              across the nation
            </p>
            <button className="w-full px-6 py-3 bg-white text-yellow-700 font-bold rounded-lg hover:bg-gray-100 transition-all">
              View Results →
            </button>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-white font-semibold">
                LIVE UPDATES
              </span>
            </div>
          </div>

          {/* Electoral Officer Card */}
          <div
            className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8 text-center transform hover:scale-105 transition-all cursor-pointer border-2 border-white/30"
            onClick={() => router.push("/electoral-officer")}
          >
            <div className="text-6xl mb-4">⚖️</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Electoral Officer
            </h2>
            <p className="text-green-100 mb-6 text-sm">
              Manage candidates, configure elections, and oversee the voting
              process
            </p>
            <button className="w-full px-6 py-3 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-all border border-white/40">
              Manage Elections →
            </button>
            <div className="mt-4">
              <span className="text-xs text-green-200">
                🔐 AUTHORIZED ACCESS
              </span>
            </div>
          </div>

          {/* Polling Station Card */}
          <div
            className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-2xl p-8 text-center transform hover:scale-105 transition-all cursor-pointer border-2 border-green-200"
            onClick={() => router.push("/setup")}
          >
            <div className="text-6xl mb-4">🏛️</div>
            <h2 className="text-2xl font-bold text-inec-primary mb-3">
              Polling Station
            </h2>
            <p className="text-gray-700 mb-6 text-sm">
              Initialize a new voting session at your polling unit and start
              accepting voters
            </p>
            <button className="w-full px-6 py-3 bg-inec-primary text-white font-bold rounded-lg hover:bg-inec-medium transition-all">
              Initialize Station →
            </button>
            <div className="mt-4">
              <span className="text-xs text-gray-600">
                START VOTING SESSION
              </span>
            </div>
          </div>
        </div>

        {/* Additional Quick Links */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center max-w-4xl mx-auto">
          <p className="text-white font-semibold mb-4">Additional Services</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => router.push("/accreditation")}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-sm border border-white/30"
            >
              👤 Voter Accreditation
            </button>
            <button
              onClick={() => router.push("/ballot")}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-sm border border-white/30"
            >
              🗳️ Cast Ballot
            </button>
            <button
              onClick={() => router.push("/audit-observer")}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-sm border border-white/30"
            >
              🔍 Audit & Observer
            </button>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
