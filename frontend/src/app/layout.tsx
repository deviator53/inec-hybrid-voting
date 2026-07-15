import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "INEC - NEVS | National Electronic Voting System",
  description:
    "Independent National Electoral Commission - Blockchain Voting System (Academic Thesis)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-ballot-cream">{children}</body>
    </html>
  );
}
