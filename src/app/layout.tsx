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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Allura&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,600&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
