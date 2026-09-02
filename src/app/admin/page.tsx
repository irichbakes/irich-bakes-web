"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Grid3X3,
  MessageSquare,
  Users,
  Calendar,
  MoreVertical,
  Plus,
  FolderPlus,
  ImagePlus,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface StatItem {
  label: string;
  count: number;
  sublabel: string;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  dotColor: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 12,
    categories: 6,
    testimonials: 8,
    subscribers: 24,
  });

  const currentDateStr = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    weekday: "long",
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const supabase = createClient();
      const [prodRes, catRes, testRes, subRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        products: prodRes.count ?? 12,
        categories: catRes.count ?? 6,
        testimonials: testRes.count ?? 8,
        subscribers: subRes.count ?? 24,
      });
      setLoading(false);
    };

    fetchCounts();
  }, []);

  const statCards: StatItem[] = [
    {
      label: "Products",
      count: stats.products,
      sublabel: "Active products",
      icon: Package,
      bgColor: "bg-[#FDF4EC]",
      iconColor: "text-[#B86E36]",
      dotColor: "bg-[#B86E36]",
    },
    {
      label: "Categories",
      count: stats.categories,
      sublabel: "Product categories",
      icon: Grid3X3,
      bgColor: "bg-[#EEF7F2]",
      iconColor: "text-[#2D8A56]",
      dotColor: "bg-[#2D8A56]",
    },
    {
      label: "Testimonials",
      count: stats.testimonials,
      sublabel: "Published reviews",
      icon: MessageSquare,
      bgColor: "bg-[#F4EFFB]",
      iconColor: "text-[#7C5295]",
      dotColor: "bg-[#7C5295]",
    },
    {
      label: "Subscribers",
      count: stats.subscribers,
      sublabel: "Newsletter subscribers",
      icon: Users,
      bgColor: "bg-[#FDF5EC]",
      iconColor: "text-[#D97706]",
      dotColor: "bg-[#D97706]",
    },
  ];

  const recentUpdates = [
    {
      id: 1,
      title: "New product added",
      detail: "Chocolate Macarons",
      time: "2 hours ago",
      icon: Package,
      bgColor: "bg-[#FDF4EC]",
      iconColor: "text-[#B86E36]",
    },
    {
      id: 2,
      title: "Category updated",
      detail: "Premium Bakes",
      time: "5 hours ago",
      icon: Grid3X3,
      bgColor: "bg-[#EEF7F2]",
      iconColor: "text-[#2D8A56]",
    },
    {
      id: 3,
      title: "Banner updated",
      detail: "Homepage banner changed",
      time: "1 day ago",
      icon: ImagePlus,
      bgColor: "bg-[#F4EFFB]",
      iconColor: "text-[#7C5295]",
    },
    {
      id: 4,
      title: "Testimonial added",
      detail: "New review from Anagha S.",
      time: "2 days ago",
      icon: MessageSquare,
      bgColor: "bg-[#FDF5EC]",
      iconColor: "text-[#D97706]",
    },
    {
      id: 5,
      title: "Newsletter subscriber",
      detail: "New subscriber added",
      time: "2 days ago",
      icon: Users,
      bgColor: "bg-[#EEF2FE]",
      iconColor: "text-[#4F46E5]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2A1C15] tracking-tight flex items-center gap-2">
            Good afternoon, Admin! <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-sm text-[#7A6658] mt-1">
            Here&apos;s what&apos;s happening with your iRich Bakes website.
          </p>
        </div>

        {/* Dynamic Date Pill */}
        <div className="self-start sm:self-auto bg-white border border-[#E3DAD1] px-4 py-2 rounded-xl shadow-2xs flex items-center gap-2.5 text-xs font-semibold text-[#4A3528]">
          <Calendar size={16} className="text-[#8C532B]" />
          <span>{currentDateStr}</span>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-5 border border-[#EBE4DC] shadow-2xs hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl ${card.bgColor} ${card.iconColor} flex items-center justify-center`}
                >
                  <Icon size={22} />
                </div>
                <span className="text-xs font-medium text-[#8C7567]">{card.label}</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-[#2A1C15]">
                  {loading ? "..." : card.count}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#8C7567]">
                  <span className={`w-2 h-2 rounded-full ${card.dotColor}`} />
                  <span>{card.sublabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Quick Actions + Website Overview (Left) & Recent Updates (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column (8 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#EBE4DC] shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#2A1C15]">Quick Actions</h2>
              <button className="text-[#A08B7D] hover:text-[#2A1C15] p-1 rounded-lg">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Action 1: Add Product */}
              <button
                onClick={() => router.push("/admin/products")}
                className="bg-[#FAF7F4] hover:bg-[#F3EDE6] border border-[#EBE4DC] rounded-xl p-4 text-center transition-all group cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-[#E3DAD1] flex items-center justify-center text-[#7C4D30] group-hover:bg-[#7C4D30] group-hover:text-white transition-colors">
                  <Plus size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2A1C15]">Add Product</p>
                  <p className="text-[11px] text-[#8C7567]">Create new product</p>
                </div>
              </button>

              {/* Action 2: Add Category */}
              <button
                onClick={() => router.push("/admin/categories")}
                className="bg-[#FAF7F4] hover:bg-[#F3EDE6] border border-[#EBE4DC] rounded-xl p-4 text-center transition-all group cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-[#E3DAD1] flex items-center justify-center text-[#7C4D30] group-hover:bg-[#7C4D30] group-hover:text-white transition-colors">
                  <FolderPlus size={19} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2A1C15]">Add Category</p>
                  <p className="text-[11px] text-[#8C7567]">Create new category</p>
                </div>
              </button>

              {/* Action 3: Add Banner */}
              <button
                onClick={() => router.push("/admin/banners")}
                className="bg-[#FAF7F4] hover:bg-[#F3EDE6] border border-[#EBE4DC] rounded-xl p-4 text-center transition-all group cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-[#E3DAD1] flex items-center justify-center text-[#7C4D30] group-hover:bg-[#7C4D30] group-hover:text-white transition-colors">
                  <ImagePlus size={19} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2A1C15]">Add Banner</p>
                  <p className="text-[11px] text-[#8C7567]">Upload new banner</p>
                </div>
              </button>
            </div>

            {/* Website Overview Showcase Banner */}
            <div className="bg-gradient-to-br from-[#FAF7F4] to-[#F3EDE6] border border-[#E3DAD1] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="space-y-3 z-10 max-w-xs text-center sm:text-left">
                <h3 className="text-base font-bold text-[#2A1C15]">Website Overview</h3>
                <p className="text-xs text-[#7A6658]">
                  Your website is live and accessible to everyone.
                </p>
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#D9CEC2] hover:bg-[#7C4D30] hover:text-white hover:border-[#7C4D30] text-[#4A3528] text-xs font-semibold rounded-xl shadow-2xs transition-all"
                >
                  <span>Visit Website</span>
                  <ExternalLink size={14} />
                </Link>
              </div>

              {/* Graphic Mockup preview */}
              <div className="relative w-full sm:w-56 h-36 flex items-center justify-center">
                {/* Desktop Screen Mockup */}
                <div className="w-48 h-28 bg-[#251811] rounded-lg p-1.5 shadow-xl border border-[#3C271C] flex flex-col relative z-0">
                  <div className="h-3 bg-[#1F130D] rounded-t flex items-center px-1.5 gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex-1 bg-[#FAF7F4] rounded-b p-2 overflow-hidden flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-amber-900/10 pb-1">
                      <span className="text-[7px] font-bold text-amber-900">irich bakes</span>
                      <div className="w-6 h-1 bg-amber-800/20 rounded" />
                    </div>
                    <div className="my-auto space-y-1">
                      <p className="text-[8px] font-bold text-[#2A1C15] leading-none">
                        Good Moments, Everyday
                      </p>
                      <div className="w-12 h-2 bg-[#7C4D30] rounded text-[5px] text-white flex items-center justify-center font-bold">
                        Shop Now
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Phone Mockup */}
                <div className="absolute right-2 bottom-0 w-16 h-28 bg-[#1F130D] rounded-xl p-1 shadow-2xl border border-[#3C271C] z-10">
                  <div className="w-full h-full bg-[#FAF7F4] rounded-lg p-1 flex flex-col justify-between overflow-hidden">
                    <div className="w-4 h-1 bg-gray-300 rounded-full mx-auto" />
                    <div className="space-y-1 my-auto">
                      <div className="w-8 h-8 rounded-md bg-[#7C4D30]/20 mx-auto flex items-center justify-center">
                        <Sparkles size={12} className="text-[#7C4D30]" />
                      </div>
                      <div className="w-10 h-1 bg-amber-900/40 rounded mx-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Updates Feed (5 cols on lg) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 border border-[#EBE4DC] shadow-2xs space-y-5 h-full flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#2A1C15]">Recent Updates</h2>
                <button className="text-[#A08B7D] hover:text-[#2A1C15] p-1 rounded-lg">
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Updates List */}
              <div className="space-y-4">
                {recentUpdates.map((update) => {
                  const Icon = update.icon;
                  return (
                    <div key={update.id} className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl ${update.bgColor} ${update.iconColor} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#2A1C15] truncate">
                            {update.title}
                          </p>
                          <p className="text-xs text-[#8C7567] truncate">{update.detail}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#A08B7D] whitespace-nowrap pt-0.5">
                        {update.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

