"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("newsletter_subscribers")
        .upsert({ email, is_active: true }, { onConflict: "email" });

      if (error) throw error;
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C4A882] focus:border-transparent transition"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-3 py-2.5 bg-[#8B6F47] hover:bg-[#7A6140] rounded-lg transition-colors disabled:opacity-50"
        aria-label="Subscribe"
      >
        <Send size={16} />
      </button>
      {status === "success" && (
        <p className="absolute mt-12 text-xs text-green-400">Subscribed!</p>
      )}
      {status === "error" && (
        <p className="absolute mt-12 text-xs text-red-400">Failed. Try again.</p>
      )}
    </form>
  );
}
