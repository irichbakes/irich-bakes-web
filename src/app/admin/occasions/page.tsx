"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { generateSlug } from "@/lib/utils/formatters";
import toast from "react-hot-toast";
import type { Occasion } from "@/lib/types/database";

const emptyOccasion: Partial<Occasion> = {
  name: "",
  slug: "",
  image_url: "",
  sort_order: 0,
  is_active: true,
};

export default function AdminOccasionsPage() {
  const [items, setItems] = useState<Occasion[]>([]);
  const [editing, setEditing] = useState<Partial<Occasion> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = async () => {
    const { data } = await supabase.from("occasions").select("*").order("sort_order");
    setItems((data as Occasion[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!editing || !editing.name) {
      toast.error("Name is required");
      return;
    }
    const payload = { ...editing, slug: editing.slug || generateSlug(editing.name) };
    try {
      if (editing.id) {
        const { error } = await supabase.from("occasions").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("occasions").insert(payload);
        if (error) throw error;
      }
      toast.success("Occasion saved successfully");
      setEditing(null);
      fetchData();
    } catch {
      toast.error("Failed to save occasion");
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    await supabase.from("occasions").delete().eq("id", deletingId);
    toast.success("Occasion deleted");
    setDeletingId(null);
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Header CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A1C15]">Occasions</h1>
          <p className="text-xs text-[#7A6658] mt-0.5">
            Curate special events (Birthdays, Weddings, Festivals) for themed cake collections.
          </p>
        </div>

        <button
          onClick={() => setEditing({ ...emptyOccasion })}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7C4D30] hover:bg-[#633B23] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Occasion</span>
        </button>
      </div>

      {/* Occasions Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 bg-white rounded-2xl border border-[#EBE4DC] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#EBE4DC] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F4] text-[#A08B7D] flex items-center justify-center mx-auto">
            <Sparkles size={24} />
          </div>
          <p className="text-sm font-semibold text-[#2A1C15]">No occasions created</p>
          <p className="text-xs text-[#8C7567]">Add festive & special event tags to group your products.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-[#EBE4DC] shadow-2xs hover:shadow-md transition-shadow text-center space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#FAF7F4] border border-[#E3DAD1] mx-auto flex items-center justify-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Sparkles size={24} className="text-[#A08B7D]" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-[#2A1C15] truncate">{item.name}</h3>
                  <p className="text-[11px] text-[#A08B7D] truncate">/{item.slug}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F0EAE3] flex items-center justify-between gap-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    item.is_active
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {item.is_active ? "Active" : "Inactive"}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing(item)}
                    className="p-1.5 hover:bg-[#FAF7F4] text-[#7A6658] hover:text-[#7C4D30] rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeletingId(item.id)}
                    className="p-1.5 hover:bg-rose-50 text-[#7A6658] hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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
        title="Delete Occasion?"
        message="Are you sure you want to delete this occasion event tag?"
      />

      {/* Occasion Add/Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-[#E3DAD1] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE4DC]">
              <h2 className="text-lg font-bold text-[#2A1C15]">
                {editing.id ? "Edit Occasion" : "Add Occasion"}
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
                  Occasion Name *
                </label>
                <input
                  type="text"
                  value={editing.name ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      name: e.target.value,
                      slug: editing.id ? editing.slug : generateSlug(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">Slug</label>
                <input
                  type="text"
                  value={editing.slug ?? ""}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30]"
                />
              </div>

              <ImageUploader
                value={editing.image_url ?? ""}
                onChange={(url) => setEditing({ ...editing, image_url: url })}
                folder="occasions"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">Sort Order</label>
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
                    <span className="text-xs font-semibold text-[#4A3528]">Active</span>
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
                Save Occasion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

