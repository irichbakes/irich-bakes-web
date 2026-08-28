"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime, formatPrice } from "@/lib/utils/formatters";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils/constants";
import toast from "react-hot-toast";
import type { Order } from "@/lib/types/database";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error("Failed"); return; }
    toast.success("Status updated");
    fetchData();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {loading ? (
        <div className="animate-pulse space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-xl" />)}</div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{order.order_number}</h3>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-500"}`}>
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDateTime(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-[#3C2415]">{formatPrice(order.total_amount)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-sm">
                <div><span className="text-gray-500">Customer:</span> <span className="font-medium">{order.customer_name}</span></div>
                <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{order.customer_phone}</span></div>
              </div>

              {/* Items */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-xs font-medium text-gray-500 mb-2">Items:</p>
                <div className="space-y-1">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {order.notes && <p className="text-xs text-gray-500 mb-3">Notes: {order.notes}</p>}

              {/* Status update */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Update status:</span>
                <div className="flex flex-wrap gap-1.5">
                  {["pending", "confirmed", "preparing", "delivered", "cancelled"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(order.id, s)}
                      disabled={order.status === s}
                      className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                        order.status === s
                          ? "bg-[#3C2415] text-white border-[#3C2415]"
                          : "border-gray-200 text-gray-600 hover:border-[#8B6F47] hover:text-[#8B6F47]"
                      }`}
                    >
                      {ORDER_STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
