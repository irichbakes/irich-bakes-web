"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Star, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ConfirmModal from "@/components/ui/ConfirmModal";
import toast from "react-hot-toast";
import type { Testimonial } from "@/lib/types/database";
import CustomSelect from "@/components/ui/CustomSelect";

const emptyTestimonial: Partial<Testimonial> = {
  customer_name: "",
  location: "",
  content: "",
  rating: 5,
  sort_order: 0,
  is_active: true,
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setItems((data as Testimonial[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!editing || !editing.customer_name || !editing.content) {
      toast.error("Customer name and review content are required");
      return;
    }
    try {
      if (editing.id) {
        const { error } = await supabase.from("testimonials").update(editing).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert(editing);
        if (error) throw error;
      }
      toast.success("Testimonial saved successfully");
      setEditing(null);
      fetchData();
    } catch {
      toast.error("Failed to save testimonial");
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    await supabase.from("testimonials").delete().eq("id", deletingId);
    toast.success("Testimonial deleted");
    setDeletingId(null);
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Header CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A1C15]">Testimonials</h1>
          <p className="text-xs text-[#7A6658] mt-0.5">
            Manage customer feedback, ratings, and published customer reviews.
          </p>
        </div>

        <button
          onClick={() => setEditing({ ...emptyTestimonial })}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7C4D30] hover:bg-[#633B23] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Testimonials List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-white rounded-2xl border border-[#EBE4DC] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#EBE4DC] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F4] text-[#A08B7D] flex items-center justify-center mx-auto">
            <MessageSquare size={24} />
          </div>
          <p className="text-sm font-semibold text-[#2A1C15]">No reviews yet</p>
          <p className="text-xs text-[#8C7567]">Add genuine customer reviews to display social proof on the website.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-[#EBE4DC] shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#7C4D30]/15 text-[#7C4D30] font-bold text-xs flex items-center justify-center">
                      {item.customer_name[0]?.toUpperCase() ?? "C"}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#2A1C15]">{item.customer_name}</h3>
                      {item.location && <p className="text-[10px] text-[#A08B7D]">{item.location}</p>}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      item.is_active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {item.is_active ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < (item.rating ?? 5)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200 fill-gray-100"
                      }
                    />
                  ))}
                </div>

                <p className="text-xs text-[#5A4537] italic leading-relaxed">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0EAE3] flex items-center justify-end gap-1">
                <button
                  onClick={() => setEditing(item)}
                  className="p-1.5 hover:bg-[#FAF7F4] text-[#7A6658] hover:text-[#7C4D30] rounded-xl transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeletingId(item.id)}
                  className="p-1.5 hover:bg-rose-50 text-[#7A6658] hover:text-rose-600 rounded-xl transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title="Delete Testimonial?"
        message="Are you sure you want to delete this customer review?"
      />

      {/* Testimonial Add/Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-[#E3DAD1] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE4DC]">
              <h2 className="text-lg font-bold text-[#2A1C15]">
                {editing.id ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="p-2 hover:bg-[#FAF7F4] text-[#8C7567] rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={editing.customer_name ?? ""}
                  onChange={(e) => setEditing({ ...editing, customer_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">Location</label>
                <input
                  type="text"
                  value={editing.location ?? ""}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  placeholder="e.g. Kochi, Kerala"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">
                  Review Text *
                </label>
                <textarea
                  value={editing.content ?? ""}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30] resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">Rating</label>
                  <CustomSelect
                    options={[5, 4, 3, 2, 1].map((r) => ({
                      value: r.toString(),
                      label: `${r} Star${r > 1 ? "s" : ""}`,
                    }))}
                    value={(editing.rating ?? 5).toString()}
                    onChange={(val) => setEditing({ ...editing, rating: parseInt(val) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">Sort</label>
                  <input
                    type="number"
                    value={editing.sort_order ?? 0}
                    onChange={(e) =>
                      setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30]"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editing.is_active ?? true}
                      onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                      className="w-4 h-4 rounded border-[#E3DAD1] text-[#7C4D30] focus:ring-[#7C4D30]"
                    />
                    <span className="text-xs font-semibold text-[#4A3528]">Published</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#EBE4DC]">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 py-2.5 bg-[#FAF7F4] hover:bg-[#F3EDE6] border border-[#E3DAD1] text-[#4A3528] font-semibold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 bg-[#7C4D30] hover:bg-[#633B23] text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

