"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Toaster
      position={mounted && isMobile ? "top-center" : "top-right"}
      gutter={8}
      toastOptions={{
        duration: 3500,
        style: {
          background: "#FFFFFF",
          color: "#2E1A0F",
          borderRadius: "12px",
          padding: "12px 18px",
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: "1.4",
          border: "1px solid #EAE3DA",
          boxShadow:
            "0 10px 25px -4px rgba(46, 26, 15, 0.12), 0 4px 10px -2px rgba(46, 26, 15, 0.05)",
          fontFamily: "'Inter', sans-serif",
          maxWidth: "480px",
          minWidth: "220px",
        },
        success: {
          iconTheme: {
            primary: "#10B981",
            secondary: "#FFFFFF",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#FFFFFF",
          },
        },
        loading: {
          iconTheme: {
            primary: "#C4A882",
            secondary: "#FFFFFF",
          },
        },
      }}
    />
  );
}
