"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

export default function AccreditationPage() {
  const router = useRouter();
  const [nin, setNin] = useState("");
  const [scanning, setScanning] = useState(false);
  const [fingerprintStatus, setFingerprintStatus] = useState(
    "Awaiting Biometric Input",
  );
  const [faceStatus, setFaceStatus] = useState("Awaiting Biometric Input");
  const [currentTime, setCurrentTime] = useState("");
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [ward, setWard] = useState("");
  const [lga, setLga] = useState("");
  const [state, setState] = useState("");
  const [sessionToken, setSessionToken] = useState("");

  useEffect(() => {
    // Load session data
    setWard(localStorage.getItem("ward") || "");
    setLga(localStorage.getItem("lga") || "");
    setState(localStorage.getItem("state") || "");
    setSessionToken(localStorage.getItem("sessionToken") || "");

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
          setBlockNumber(data.blockNumber);
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

  const handleNinChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "").slice(0, 11);
    setNin(cleaned);
  };

  const formatNin = (value: string) => {
    return value
      .split("")
      .map((char, i) => char)
      .join(" ");
  };

  const startBiometricScan = async () => {
    if (nin.length !== 11) return;

    setScanning(true);
    setFingerprintStatus("⟳ Scanning...");
    setFaceStatus("Camera Standby");

    try {
      // Fingerprint scan
      const fpRes = await fetch(
        "http://localhost:5050/api/biometric/fingerprint/scan",
        {
          method: "POST",
        },
      );
      const fpData = await fpRes.json();
      setFingerprintStatus("✓ Fingerprint Captured");

      // Face capture
      setFaceStatus("⟳ Capturing...");
      const faceRes = await fetch(
        "http://localhost:5050/api/biometric/face/capture",
        {
          method: "POST",
        },
      );
      const faceData = await faceRes.json();
      setFaceStatus("✓ Face Recognized");

      // Accredit voter
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const accreditRes = await fetch(
        "http://localhost:5000/api/voter/accredit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nin,
            sessionId: sessionToken,
            ward,
            lga,
            state,
            fingerprintHash: fpData.fingerprintHash,
            faceHash: faceData.faceHash,
          }),
        },
      );

      const accreditData = await accreditRes.json();
      if (accreditData.success) {
        localStorage.setItem("voterHash", accreditData.voterHash);
        setTimeout(() => router.push("/ballot"), 1000);
      } else {
        alert(accreditData.error);
        setFingerprintStatus("Awaiting Biometric Input");
        setFaceStatus("Awaiting Biometric Input");
      }
    } catch (error) {
      console.error("Accreditation failed:", error);
      alert("Accreditation failed. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-inec-dark">
      <Navigation />
      {/* Header */}
      <div className="bg-inec-primary border-b border-green-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-700 rounded flex items-center justify-center">
              <span className="text-xl">⚖️</span>
            </div>
            <div>
              <h1 className="text-white font-semibold">
                INEC — FEDERAL REPUBLIC OF NIGERIA
              </h1>
              <p className="text-green-300 text-sm">
                {ward && lga ? `${ward}, ${lga}` : "Loading..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-green-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online
            </span>
            <span className="text-green-400 text-sm">
              {blockNumber !== null
                ? `Synced (Block #${blockNumber.toLocaleString()})`
                : "Syncing..."}
            </span>
            <span className="text-white text-sm">{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-black bg-opacity-50 min-h-screen border-r border-green-900">
          <div className="p-6">
            <div className="mb-8">
              <div className="w-12 h-12 bg-inec-primary rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl">⚖️</span>
              </div>
              <p className="text-white font-semibold">NEVS</p>
              <p className="text-green-400 text-sm">v2.1.4</p>
            </div>

            <nav className="space-y-2">
              <div className="px-4 py-3 bg-inec-primary rounded-lg flex items-center gap-3 cursor-pointer">
                <span className="text-lg">👆</span>
                <div>
                  <p className="text-white font-medium text-sm">
                    Accreditation
                  </p>
                  <p className="text-green-300 text-xs">
                    Biometric Verification
                  </p>
                </div>
              </div>

              <div
                onClick={() => router.push("/ballot")}
                className="px-4 py-3 hover:bg-gray-800 rounded-lg flex items-center gap-3 cursor-pointer"
              >
                <span className="text-lg">☑️</span>
                <div>
                  <p className="text-gray-400 font-medium text-sm">
                    Ballot Box
                  </p>
                  <p className="text-gray-500 text-xs">Anonymous Voting</p>
                </div>
              </div>

              <div
                onClick={() => router.push("/audit-observer")}
                className="px-4 py-3 hover:bg-gray-800 rounded-lg flex items-center gap-3 cursor-pointer"
              >
                <span className="text-lg">📊</span>
                <div>
                  <p className="text-gray-400 font-medium text-sm">
                    Ledger Audit
                  </p>
                  <p className="text-gray-500 text-xs">Observer Dashboard</p>
                </div>
              </div>
            </nav>

            <div className="mt-12 p-4 bg-inec-dark border border-green-900 rounded-lg">
              <p className="text-green-400 text-xs mb-2">
                INEC-Certified Terminal
              </p>
              <p className="text-gray-400 text-xs">Serial: WT02-NGR-0041</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl text-white font-semibold mb-2">
              Supervisor Accreditation Dashboard
            </h2>
            <p className="text-green-400 mb-8">
              Biometric Verification — Polling Station Officer Access
            </p>

            <div className="grid grid-cols-2 gap-6">
              {/* NIN Input */}
              <div className="bg-black bg-opacity-40 border-2 border-green-900 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-green-400">🔐</span>
                  <h3 className="text-white font-semibold uppercase text-sm tracking-wide">
                    NIN VERIFICATION
                  </h3>
                </div>

                <div className="mb-6">
                  <label className="block text-green-400 text-xs uppercase mb-3 tracking-wide">
                    NATIONAL IDENTIFICATION NUMBER
                  </label>
                  <div className="bg-inec-dark border border-green-800 rounded p-4 mb-4">
                    <div className="font-mono text-3xl text-green-400 text-center tracking-widest">
                      {formatNin(nin).padEnd(21, "_")}
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-2">
                      {nin.length}/11 digits entered
                    </p>
                  </div>

                  <input
                    type="text"
                    value={nin}
                    onChange={(e) => handleNinChange(e.target.value)}
                    placeholder="Enter 11-digit NIN"
                    className="w-full px-4 py-3 bg-inec-dark border border-green-800 text-green-400 rounded focus:outline-none focus:border-green-600 font-mono"
                  />
                </div>

                <button
                  onClick={startBiometricScan}
                  disabled={nin.length !== 11 || scanning}
                  className="w-full py-3 bg-inec-medium hover:bg-inec-light disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded transition-all flex items-center justify-center gap-2"
                >
                  <span>👆</span>
                  Start Biometric Scan
                </button>

                <div className="mt-6 p-3 bg-inec-dark border border-green-900 rounded">
                  <p className="text-xs text-green-400 flex items-center gap-2">
                    <span>ℹ️</span>
                    All verification attempts are cryptographically logged to
                    the blockchain
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">
                    Session ID:{" "}
                    {sessionToken
                      ? `${sessionToken.slice(0, 8)}...${sessionToken.slice(-4)}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Biometric Peripheral */}
              <div className="bg-black bg-opacity-40 border-2 border-green-900 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-green-400">🔬</span>
                  <h3 className="text-white font-semibold uppercase text-sm tracking-wide">
                    BIOMETRIC PERIPHERAL
                  </h3>
                </div>

                {/* Fingerprint Scanner */}
                <div className="mb-6">
                  <label className="block text-green-400 text-xs uppercase mb-3 tracking-wide">
                    FINGERPRINT SCANNER
                  </label>
                  <div className="bg-inec-dark border border-green-800 rounded-lg p-8 flex flex-col items-center justify-center h-48">
                    <div className="w-24 h-24 border-4 border-green-800 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-5xl opacity-50">👆</span>
                    </div>
                    <p className="text-green-400 text-sm">
                      {fingerprintStatus}
                    </p>
                  </div>
                </div>

                {/* Facial Recognition */}
                <div>
                  <label className="block text-green-400 text-xs uppercase mb-3 tracking-wide">
                    FACIAL RECOGNITION CAMERA
                  </label>
                  <div className="bg-inec-dark border border-green-800 rounded-lg p-8 flex flex-col items-center justify-center h-64">
                    <div className="w-32 h-32 border-4 border-green-800 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-6xl opacity-50">📷</span>
                    </div>
                    <p className="text-green-400 text-sm">{faceStatus}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                NEVS © INEC 2025 — Hybrid Blockchain Electronic Voting System
              </p>
              <p className="text-xs text-green-800 mt-1 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                System Uptime: 4:12:48
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
