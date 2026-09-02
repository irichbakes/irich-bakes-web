"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Welcome back to iRich Bakes Admin!");
      router.replace("/admin");
    } catch {
      toast.error("Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#251811] px-4 py-12 relative overflow-hidden">
      {/* Ambient warm glow backgrounds */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#7C4D30]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#8C532B]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="bg-[#FAF7F4] px-6 py-3 rounded-2xl shadow-xl border border-[#E3DAD1] inline-block">
            <Image
              src="/irich-logo.png"
              alt="iRich Bakes Logo"
              width={140}
              height={45}
              className="h-9 w-auto object-contain"
              priority
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white tracking-tight">Admin Portal</h1>
            <p className="text-xs text-amber-200/60">
              Sign in to manage products, orders, and content
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-[#E3DAD1] space-y-5"
        >
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#4A3528]">Email Address</label>
            <div className="relative">
              <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A08B7D]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] outline-none focus:border-[#7C4D30] focus:ring-2 focus:ring-[#7C4D30]/15"
                placeholder="admin@irich.co.in"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#4A3528]">Password</label>
            <div className="relative">
              <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A08B7D]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] outline-none focus:border-[#7C4D30] focus:ring-2 focus:ring-[#7C4D30]/15"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7C4D30] hover:bg-[#633B23] text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{loading ? "Signing in..." : "Sign In to Dashboard"}</span>
            {!loading && <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </form>

        <p className="text-center text-[11px] text-amber-100/40">
          © 2026 iRich Bakes. Authorized personnel only.
        </p>
      </div>
    </div>
  );
}

