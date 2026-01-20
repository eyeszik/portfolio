import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aurora Blueprint Studio",
  description: "Governance-aware autonomous workflow blueprint generator"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
