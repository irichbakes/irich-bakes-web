"use client";

import { useEffect, useState } from "react";
import { MessageCircle, ShoppingBag, Phone, User, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime, formatPrice } from "@/lib/utils/formatters";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils/constants";
import toast from "react-hot-toast";
import type { Order } from "@/lib/types/database";
import CustomSelect, { type CustomSelectOption } from "@/components/ui/CustomSelect";

const statusOptions: CustomSelectOption[] = [
  { value: "pending", label: "Pending", badgeColor: "bg-amber-100 text-amber-800" },
  { value: "confirmed", label: "Confirmed", badgeColor: "bg-blue-100 text-blue-800" },
  { value: "preparing", label: "Preparing", badgeColor: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "Delivered", badgeColor: "bg-emerald-100 text-emerald-800" },
  { value: "cancelled", label: "Cancelled", badgeColor: "bg-rose-100 text-rose-800" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const supabase = createClient();

  const fetchData = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      toast.error("Failed to update status");
      return;
    }
    toast.success("Order status updated");
    fetchData();
  };

  const filteredOrders = orders.filter(
    (o) => filterStatus === "all" || o.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A1C15]">WhatsApp Enquiries & Orders</h1>
          <p className="text-xs text-[#7A6658] mt-0.5">
            Track customer enquiries, cake orders, and fulfillment updates.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {["all", "pending", "confirmed", "preparing", "delivered", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === st
                  ? "bg-[#7C4D30] text-white shadow-2xs"
                  : "bg-white border border-[#E3DAD1] text-[#4A3528] hover:bg-[#FAF7F4]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-white rounded-2xl border border-[#EBE4DC] animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#EBE4DC] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F4] text-[#A08B7D] flex items-center justify-center mx-auto">
            <ShoppingBag size={24} />
          </div>
          <p className="text-sm font-semibold text-[#2A1C15]">No orders found</p>
          <p className="text-xs text-[#8C7567]">There are no customer enquiries matching this status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-5 border border-[#EBE4DC] shadow-2xs space-y-4"
            >
              {/* Header bar of order card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EAE3]">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#2A1C15]">{order.order_number}</span>
                    <span
                      className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                        ORDER_STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#8C7567]">
                    <Calendar size={13} />
                    <span>{formatDateTime(order.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#A08B7D] block uppercase font-medium">Total Amount</span>
                    <span className="font-bold text-lg text-[#7C4D30]">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>

                  {order.customer_phone && (
                    <a
                      href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(
                        order.customer_name
                      )},%20regarding%20your%20iRich%20Bakes%20order%20${order.order_number}...`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors inline-flex items-center gap-1.5 text-xs font-semibold"
                      title="Contact on WhatsApp"
                    >
                      <MessageCircle size={16} />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Customer details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAF7F4] p-3 rounded-xl border border-[#E3DAD1]">
                <div className="flex items-center gap-2 text-[#4A3528]">
                  <User size={14} className="text-[#8C532B]" />
                  <span className="font-medium text-[#7A6658]">Customer:</span>
                  <span className="font-bold text-[#2A1C15]">{order.customer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-[#4A3528]">
                  <Phone size={14} className="text-[#8C532B]" />
                  <span className="font-medium text-[#7A6658]">Phone:</span>
                  <span className="font-bold text-[#2A1C15]">{order.customer_phone}</span>
                </div>
              </div>

              {/* Items summary */}
              <div className="bg-white border border-[#EBE4DC] rounded-xl p-3 space-y-2">
                <p className="text-xs font-bold text-[#4A3528]">Items Ordered:</p>
                <div className="space-y-1.5">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-[#2A1C15]">
                        <span className="font-bold text-[#7C4D30]">{item.quantity}x</span> {item.name}
                      </span>
                      <span className="font-semibold text-[#5A4537]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {order.notes && (
                <p className="text-xs text-[#7A6658] italic bg-[#FAF7F4] p-2.5 rounded-xl border border-[#E3DAD1]">
                  Note: {order.notes}
                </p>
              )}

              {/* Update Status Dropdown */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#F0EAE3]">
                <span className="text-xs font-semibold text-[#5A4537]">Order Status:</span>
                <CustomSelect
                  options={statusOptions}
                  value={order.status}
                  onChange={(val) => updateStatus(order.id, val)}
                  align="right"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

