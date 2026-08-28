"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, Grid3X3, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface StatCard {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      const [products, categories, orders, subscribers] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      ]);

      setStats([
        { label: "Products", value: products.count ?? 0, icon: Package, color: "bg-blue-50 text-blue-600" },
        { label: "Categories", value: categories.count ?? 0, icon: Grid3X3, color: "bg-green-50 text-green-600" },
        { label: "Orders", value: orders.count ?? 0, icon: ShoppingCart, color: "bg-orange-50 text-orange-600" },
        { label: "Subscribers", value: subscribers.count ?? 0, icon: Users, color: "bg-purple-50 text-purple-600" },
      ]);
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                <div className={`w-9 h-9 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
