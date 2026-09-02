"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutGrid,
  Image as ImageIcon,
  Grid3X3,
  Package,
  Sparkles,
  MessageSquare,
  MessageCircle,
  Mail,
  Settings,
  ExternalLink,
  ChevronDown,
  X,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function AdminSidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const navSections = [
    {
      title: null,
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutGrid },
      ],
    },
    {
      title: "CONTENT",
      items: [
        { label: "Banners", href: "/admin/banners", icon: ImageIcon },
        { label: "Categories", href: "/admin/categories", icon: Grid3X3 },
        { label: "Products", href: "/admin/products", icon: Package },
        { label: "Occasions", href: "/admin/occasions", icon: Sparkles },
        { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
      ],
    },
    {
      title: "ENGAGEMENT",
      items: [
        { label: "WhatsApp Enquiries", href: "/admin/orders", icon: MessageCircle },
        { label: "Newsletter Subscribers", href: "/admin/newsletter", icon: Mail },
      ],
    },
    {
      title: "WEBSITE",
      items: [
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const [unreadNewsletter, setUnreadNewsletter] = useState(0);

  const checkUnreadNewsletter = async () => {
    try {
      const supabase = createClient();
      const { count } = await supabase
        .from("newsletter_subscribers")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false);
      setUnreadNewsletter(count ?? 0);
    } catch {
      // Ignore fallback
    }
  };

  useEffect(() => {
    checkUnreadNewsletter();
    const handleRead = () => checkUnreadNewsletter();
    window.addEventListener("newsletter_read", handleRead);
    return () => window.removeEventListener("newsletter_read", handleRead);
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 h-full w-[260px] bg-[#251811] text-amber-50 flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header / Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#36241A]/60">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="bg-[#FAF7F4] px-3 py-1.5 rounded-xl shadow-xs flex items-center justify-center">
              <Image
                src="/irich-logo.png"
                alt="iRich Bakes Logo"
                width={110}
                height={32}
                className="h-6 w-auto object-contain"
                priority
              />
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-amber-200/70 hover:text-white hover:bg-[#36241A] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 no-scrollbar">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              {section.title && (
                <div className="px-3 text-[11px] font-semibold tracking-wider text-[#A0887A] uppercase mb-2">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                const isNewsletter = item.href === "/admin/newsletter";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                      active
                        ? "bg-[#7C4D30] text-white shadow-sm"
                        : "text-amber-100/70 hover:bg-[#36241A] hover:text-white"
                    }`}
                  >
                    <Icon
                      size={19}
                      className={`transition-colors ${
                        active ? "text-white" : "text-amber-200/60 group-hover:text-white"
                      }`}
                    />
                    <span className="flex-1 min-w-0 truncate">{item.label}</span>
                    {isNewsletter && unreadNewsletter > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full shadow-xs animate-pulse">
                        {unreadNewsletter} New
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Area: Visit Website Card + User Profile */}
        <div className="p-4 border-t border-[#36241A]/60 space-y-3 bg-[#1F130D]">
          {/* Visit Website Promo Box */}
          <div className="bg-[#2A1B14] border border-[#3C271C] rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Visit Website</p>
              <p className="text-[11px] text-amber-200/50">View your live website</p>
            </div>
            <Link
              href="/"
              target="_blank"
              className="p-2 bg-[#3C271C] hover:bg-[#7C4D30] text-white rounded-lg transition-colors"
              title="Open Live Website"
            >
              <ExternalLink size={15} />
            </Link>
          </div>

          {/* Admin User Card */}
          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#7C4D30] text-white flex items-center justify-center font-bold text-sm shadow-inner">
                  A
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#1F130D] rounded-full" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-white leading-tight">Admin User</p>
                <p className="text-[11px] text-amber-200/50 leading-tight">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-amber-200/60 hover:text-rose-400 hover:bg-[#2A1B14] rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

