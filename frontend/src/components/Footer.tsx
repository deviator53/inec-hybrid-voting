"use client";

import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-inec-primary text-white py-12 px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">INEC NEVS</h3>
            <p className="text-green-100 text-sm mb-4">
              National Electronic Voting System - A secure, transparent, and
              blockchain-powered voting platform for Nigeria.
            </p>
            <p className="text-xs text-green-200">🇳🇬 Federal Republic of Nigeria</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => router.push("/")}
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/live-polls")}
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Live Results
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/setup")}
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Polling Station
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/audit-observer")}
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Audit & Observer
                </button>
              </li>
            </ul>
          </div>

          {/* For Officials */}
          <div>
            <h4 className="font-semibold mb-4">For Officials</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => router.push("/electoral-officer")}
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Electoral Officer Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/accreditation")}
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Voter Accreditation
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/ballot")}
                  className="text-green-100 hover:text-white transition-colors"
                >
                  Cast Ballot
                </button>
              </li>
            </ul>
          </div>

          {/* System Info */}
          <div>
            <h4 className="font-semibold mb-4">System Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⛓️</span>
                <div>
                  <p className="text-green-100">Blockchain</p>
                  <p className="text-xs text-green-200">Polygon Network</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="text-green-100">Secure</p>
                  <p className="text-xs text-green-200">End-to-End Encryption</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="text-green-100">Transparent</p>
                  <p className="text-xs text-green-200">Publicly Verifiable</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-green-100">
              © 2026 Independent National Electoral Commission (INEC)
            </p>
            <div className="flex gap-4">
              <span className="text-green-200 text-xs">
                NEVS v2.1.4 · Academic Thesis
              </span>
              <span className="text-yellow-400 text-xs font-semibold">
                NOT FOR PRODUCTION
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
