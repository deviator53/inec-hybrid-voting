"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  nigeriaStates,
  getLGAsForState,
  getAllStateNames,
} from "@/data/nigeriaData";

export default function SetupPage() {
  const router = useRouter();
  const [hardwareStatus, setHardwareStatus] = useState<any>(null);
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [ward, setWard] = useState("");
  const [presidingOfficer, setPresidingOfficer] = useState("");
  const [systemReady, setSystemReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get all Nigerian states from the data file
  const states = getAllStateNames();

  useEffect(() => {
    fetchHardwareStatus();
    const interval = setInterval(fetchHardwareStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchHardwareStatus = async () => {
    try {
      const hardwareBridgeUrl =
        process.env.NEXT_PUBLIC_HARDWARE_BRIDGE_URL || "http://localhost:5050";
      const res = await fetch(`${hardwareBridgeUrl}/api/hardware/status`);
      const data = await res.json();
      setHardwareStatus(data);
      setSystemReady(data.allSystemsNominal);
    } catch (error) {
      console.error("Hardware check failed:", error);
    }
  };

  const initializeSession = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/session/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ward, lga, state, presidingOfficer }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("sessionToken", data.sessionToken);
        localStorage.setItem("ward", ward);
        localStorage.setItem("lga", lga);
        localStorage.setItem("state", state);
        setTimeout(() => router.push("/accreditation"), 800);
      }
    } catch (error) {
      console.error("Session init failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ballot-cream flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="bg-inec-primary rounded-t-lg p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-inec-medium rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-inec-primary rounded-full flex items-center justify-center">
              <span className="text-3xl text-white font-bold">⚖️</span>
            </div>
          </div>
          <p className="text-sm text-green-200 uppercase tracking-widest mb-2">
            FEDERAL REPUBLIC OF NIGERIA
          </p>
          <h1 className="text-2xl text-white font-semibold mb-1">
            Independent National Electoral Commission
          </h1>
          <p className="text-green-300 text-sm">
            National Electronic Voting System (NEVS)
          </p>
          <div className="mt-4 py-2 px-4 bg-inec-dark bg-opacity-50 rounded inline-block">
            <p className="text-green-200 text-xs uppercase tracking-wide">
              SESSION INITIALIZATION — ELECTION DAY PROTOCOL
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-b-lg shadow-xl p-8">
          {/* Hardware Status */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                HARDWARE & NODE STATUS
              </h3>
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                ALL SYSTEMS NOMINAL
              </span>
            </div>

            <div className="space-y-3">
              {/* Biometric Scanner */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">👆</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Biometric Scanner
                    </p>
                    <p className="text-xs text-gray-500">
                      {hardwareStatus?.hardware?.biometric_scanner?.model ||
                        "Connecting..."}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                  • CONNECTED
                </span>
              </div>

              {/* Thermal Printer */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🖨️</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Thermal Printer</p>
                    <p className="text-xs text-gray-500">
                      {hardwareStatus?.hardware?.thermal_printer?.model ||
                        "Connecting..."}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                  • CONNECTED
                </span>
              </div>

              {/* Blockchain Node */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⛓️</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Blockchain Local Node
                    </p>
                    <p className="text-xs text-gray-500">
                      {hardwareStatus?.hardware?.blockchain_node?.model ||
                        "Syncing..."}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                    • SYNCED
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    HEIGHT:{" "}
                    {hardwareStatus?.hardware?.blockchain_node?.height?.toLocaleString() ||
                      "---"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Session Configuration */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                SESSION CONFIGURATION
              </h3>
              <span className="text-xs text-amber-600 font-medium">
                ⚠ REQUIRES AUTHORIZATION
              </span>
            </div>

            <div className="space-y-4">
              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  STATE <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setLga(""); // Reset LGA when state changes
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-inec-primary focus:outline-none appearance-none bg-white"
                    required
                  >
                    <option value="">-- Select State --</option>
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ▼
                  </span>
                </div>
              </div>

              {/* LGA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LOCAL GOVERNMENT AREA <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                    disabled={!state}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-inec-primary focus:outline-none appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">-- Select LGA --</option>
                    {state &&
                      getLGAsForState(state).map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                  </select>
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    ▼
                  </span>
                </div>
              </div>

              {/* Ward */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WARD COLLATION CENTER ID{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-inec-primary focus:outline-none"
                  placeholder="Maikunkele Ward 02"
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  ⓘ This ID is cryptographically bound to this session. Verify
                  against your INEC-issued deployment manifest.
                </span>
              </div>
            </div>
          </div>

          {/* Presiding Officer */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
              PRESIDING OFFICER VERIFICATION
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PRESIDING OFFICER NAME <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={presidingOfficer}
                onChange={(e) => setPresidingOfficer(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-inec-primary focus:outline-none"
                placeholder="Enter full name (e.g., IBRAHIM MUSA ALIYU)"
                required
              />
              {presidingOfficer && (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200 mt-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {presidingOfficer}
                      </p>
                      <p className="text-xs text-gray-600">
                        Presiding Officer
                        {state && lga ? ` - ${state} · ${lga}` : ""}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded">
                    ✓ ENTERED
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                SYSTEM READINESS
              </span>
              <span className="text-sm font-bold text-green-600">100%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all duration-500"
                style={{ width: "100%" }}
              ></div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-green-600 font-medium">
                CLEARED FOR DEPLOYMENT
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={initializeSession}
            disabled={
              !systemReady ||
              loading ||
              !state ||
              !lga ||
              !ward ||
              !presidingOfficer
            }
            className="w-full py-4 bg-inec-primary hover:bg-inec-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⚙️</span>
                INITIALIZING SESSION...
              </>
            ) : (
              <>
                <span>⚡</span>
                START ELECTION SESSION →
              </>
            )}
          </button>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>🔒 Run Diagnostics</span>
              <span>📋 View System Log</span>
              <span>⚠️ Report Issue</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              NEVS v2.1.4 · Build 2026-06-04 · Certified (ENVSC 27001)
            </p>
            <p className="text-xs text-gray-400 mt-2">
              SESSION TOKEN: NVS-2025-N5R-4FTA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
