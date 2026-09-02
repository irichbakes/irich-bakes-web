"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu, Search, Bell, ChevronDown } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || (!session && pathname !== "/admin/login")) {
        router.replace("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F4] font-sans antialiased text-[#2A1C15] flex">
      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px] transition-all duration-300">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 h-18 bg-[#FAF7F4]/90 backdrop-blur-md border-b border-[#EAE3DA] px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Left Header Section */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-[#5A4234] hover:bg-[#EFE9E2] rounded-xl transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>

            {/* Search Input Bar */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A08B7D]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 bg-white/80 border border-[#E3DAD1] focus:border-[#7C4D30] focus:ring-2 focus:ring-[#7C4D30]/15 rounded-xl text-sm placeholder-[#A08B7D] outline-none transition-all"
              />
            </div>
          </div>

          {/* Right Header Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 bg-white/80 border border-[#E3DAD1] hover:bg-[#EFE9E2] text-[#4A3528] rounded-xl transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B8401A] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#FAF7F4]">
                  3
                </span>
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E3DAD1] rounded-2xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE3]">
                    <h4 className="font-semibold text-sm text-[#2A1C15]">Notifications</h4>
                    <span className="text-[11px] font-medium px-2 py-0.5 bg-[#FAF3EC] text-[#8C532B] rounded-full">
                      3 Unread
                    </span>
                  </div>
                  <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                    <div className="p-2.5 rounded-xl bg-[#FAF7F4] hover:bg-[#F3EDE6] transition-colors cursor-pointer text-xs">
                      <p className="font-semibold text-[#2A1C15]">New WhatsApp Enquiry</p>
                      <p className="text-[#7A6658]">Customer requested custom cake quote.</p>
                      <span className="text-[10px] text-[#A08B7D] mt-1 block">10 mins ago</span>
                    </div>
                    <div className="p-2.5 rounded-xl hover:bg-[#FAF7F4] transition-colors cursor-pointer text-xs">
                      <p className="font-semibold text-[#2A1C15]">New Newsletter Subscriber</p>
                      <p className="text-[#7A6658]">anagha@example.com subscribed.</p>
                      <span className="text-[10px] text-[#A08B7D] mt-1 block">2 hours ago</span>
                    </div>
                    <div className="p-2.5 rounded-xl hover:bg-[#FAF7F4] transition-colors cursor-pointer text-xs">
                      <p className="font-semibold text-[#2A1C15]">Product Stock Update</p>
                      <p className="text-[#7A6658]">Chocolate Macarons updated successfully.</p>
                      <span className="text-[10px] text-[#A08B7D] mt-1 block">5 hours ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Quick Pill */}
            <div className="flex items-center gap-2.5 p-1.5 pr-3 bg-white/80 border border-[#E3DAD1] rounded-xl hover:bg-[#EFE9E2] cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#7C4D30] text-white flex items-center justify-center font-bold text-xs shadow-inner">
                A
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-[#2A1C15]">
                Admin User
              </span>
              <ChevronDown size={14} className="text-[#8C7567]" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

