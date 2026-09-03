import type { Metadata } from "next";
import ToastProvider from "@/components/ui/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "iRich Bakes | Fresh Cakes & Bakery",
  description: "Freshly baked cookies, cakes, muffins, and treats made with quality ingredients and delivered across Kerala.",
  keywords: "bakery, cakes, cookies, muffins, Kerala, fresh bakes",
  icons: {
    icon: "/irich-logo.png",
    apple: "/irich-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
