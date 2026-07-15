"use client";

import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Accreditation", path: "/accreditation", icon: "✅" },
    { name: "Ballot", path: "/ballot", icon: "🗳️" },
    { name: "Live Results", path: "/live-polls", icon: "📊" },
    { name: "Electoral Officer", path: "/electoral-officer", icon: "⚖️" },
    { name: "Audit Observer", path: "/audit-observer", icon: "🔍" },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center gap-2 overflow-x-auto py-3">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-inec-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
