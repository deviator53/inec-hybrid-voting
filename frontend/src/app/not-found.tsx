"use client";

import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gradient-to-br from-inec-primary via-inec-medium to-inec-light flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Icon */}
          <div className="w-48 h-48 mx-auto mb-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-9xl">❓</span>
          </div>

          {/* Error Message */}
          <h1 className="text-8xl font-bold text-white mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-xl text-green-100 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => router.push("/")}
              className="w-full max-w-md mx-auto block px-8 py-4 bg-white text-inec-primary font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              🏠 Return to Homepage
            </button>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/live-polls")}
                className="px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all border border-white/40"
              >
                📊 View Live Results
              </button>
              <button
                onClick={() => router.push("/setup")}
                className="px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all border border-white/40"
              >
                🏛️ Polling Station
              </button>
              <button
                onClick={() => router.push("/electoral-officer")}
                className="px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-all border border-white/40"
              >
                ⚖️ Electoral Officer
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <p className="text-white font-semibold mb-3">Need Help?</p>
            <p className="text-green-100 text-sm">
              If you believe this is an error, please contact your system
              administrator or navigate using the options above.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
