"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, Search, CheckCircle2, Sparkles, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { formatDate } from "@/lib/utils/formatters";
import toast from "react-hot-toast";
import type { NewsletterSubscriber } from "@/lib/types/database";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  const fetchData = async () => {
    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    setSubscribers((data as NewsletterSubscriber[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({ is_read: true })
        .eq("is_read", false);

      if (error) throw error;

      toast.success("All newsletter subscribers marked as read");
      fetchData();
      window.dispatchEvent(new Event("newsletter_read"));
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const markSingleAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      fetchData();
      window.dispatchEvent(new Event("newsletter_read"));
    } catch {
      toast.error("Failed to update status");
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    await supabase.from("newsletter_subscribers").delete().eq("id", deletingId);
    toast.success("Subscriber removed");
    setDeletingId(null);
    fetchData();
    window.dispatchEvent(new Event("newsletter_read"));
  };

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(search.toLowerCase())
  );

  const unreadSubscribersCount = subscribers.filter((s) => s.is_read === false).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A1C15]">Newsletter Subscribers</h1>
          <p className="text-xs text-[#7A6658] mt-0.5">
            Manage customer email subscriptions for marketing updates and promotions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadSubscribersCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <CheckCircle2 size={15} />
              <span>Mark All as Read</span>
            </button>
          )}

          <div className="bg-white border border-[#E3DAD1] px-4 py-2 rounded-xl shadow-2xs text-xs font-bold text-[#7C4D30]">
            Total: {subscribers.length} Subscribers
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#EBE4DC] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A08B7D]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email address..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] outline-none focus:border-[#7C4D30]"
          />
        </div>

        {unreadSubscribersCount > 0 && (
          <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
            <Sparkles size={14} />
            <span>{unreadSubscribersCount} Unread subscriber{unreadSubscribersCount > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-white rounded-2xl border border-[#EBE4DC] animate-pulse" />
          ))}
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#EBE4DC] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F4] text-[#A08B7D] flex items-center justify-center mx-auto">
            <Mail size={24} />
          </div>
          <p className="text-sm font-semibold text-[#2A1C15]">No subscribers found</p>
          <p className="text-xs text-[#8C7567]">There are no newsletter subscribers matching your search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EBE4DC] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F4] border-b border-[#EBE4DC] text-[#7A6658] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Email Address</th>
                  <th className="px-5 py-3.5 hidden sm:table-cell">Subscribed Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE3]">
                {filteredSubscribers.map((sub) => {
                  const isUnread = sub.is_read === false;
                  return (
                    <tr
                      key={sub.id}
                      className={`transition-colors ${
                        isUnread ? "bg-amber-50/40 hover:bg-amber-50/70" : "hover:bg-[#FAF7F4]/60"
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isUnread
                                ? "bg-rose-100 text-rose-600 font-bold"
                                : "bg-[#7C4D30]/10 text-[#7C4D30]"
                            }`}
                          >
                            <Mail size={14} />
                          </div>
                          <span className="font-semibold text-[#2A1C15]">{sub.email}</span>
                          {isUnread && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full border border-rose-200 shadow-2xs animate-pulse">
                              ● NEW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell text-[#7A6658]">
                        {formatDate(sub.created_at)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isUnread && (
                            <button
                              onClick={() => markSingleAsRead(sub.id)}
                              className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-colors inline-flex items-center gap-1 text-[11px] font-semibold"
                              title="Mark as Read"
                            >
                              <Check size={14} />
                              <span className="hidden sm:inline">Mark Read</span>
                            </button>
                          )}
                          <button
                            onClick={() => setDeletingId(sub.id)}
                            className="p-2 hover:bg-rose-50 text-[#7A6658] hover:text-rose-600 rounded-xl transition-colors"
                            title="Remove Subscriber"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title="Remove Subscriber?"
        message="Are you sure you want to remove this subscriber from your newsletter mailing list?"
      />
    </div>
  );
}



