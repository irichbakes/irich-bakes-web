import type { Metadata } from "next";
import ToastProvider from "@/components/ui/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "iRich Bakes | Premium Homemade Bakes",
  description: "Premium homemade bakes crafted with care using the finest ingredients. Freshly baked cookies, cakes, muffins, and more delivered across Kerala.",
  keywords: "bakery, homemade bakes, cookies, cakes, muffins, Kerala, premium bakes",
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
