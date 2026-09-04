"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Smartphone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import toast from "react-hot-toast";
import type { Banner } from "@/lib/types/database";
import { revalidateBanners } from "./actions";

const emptyBanner: Partial<Banner> = {
  title: "",
  subtitle: "",
  image_url: "",
  mobile_image_url: "",
  cta_text: "",
  cta_link: "",
  sort_order: 0,
  is_active: true,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editing, setEditing] = useState<Partial<Banner> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchData = async () => {
    const { data } = await supabase.from("banners").select("*").order("sort_order");
    setBanners((data as Banner[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    try {
      if (editing.id) {
        const { id, created_at, ...updateData } = editing;
        const { error } = await supabase.from("banners").update(updateData).eq("id", id);
        if (error) throw error;
      } else {
        const { id, ...insertData } = editing;
        const { error } = await supabase.from("banners").insert(insertData);
        if (error) throw error;
      }
      await revalidateBanners();
      toast.success("Banner saved successfully");
      setEditing(null);
      fetchData();
    } catch {
      toast.error("Failed to save banner");
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      const { error } = await supabase.from("banners").delete().eq("id", deletingId);
      if (error) throw error;
      await revalidateBanners();
      toast.success("Banner deleted");
      setDeletingId(null);
      fetchData();
    } catch {
      toast.error("Failed to delete banner");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A1C15]">Banners</h1>
          <p className="text-xs text-[#7A6658] mt-0.5">
            Manage homepage hero banners, promotional slides, and mobile hero images.
          </p>
        </div>

        <button
          onClick={() => setEditing({ ...emptyBanner })}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7C4D30] hover:bg-[#633B23] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Banner</span>
        </button>
      </div>

      {/* Banner Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-[#EBE4DC] animate-pulse" />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#EBE4DC] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F4] text-[#A08B7D] flex items-center justify-center mx-auto">
            <ImageIcon size={24} />
          </div>
          <p className="text-sm font-semibold text-[#2A1C15]">No banners yet</p>
          <p className="text-xs text-[#8C7567]">Upload your first banner slide to display on the homepage.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EBE4DC] shadow-2xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-20 h-14 rounded-xl overflow-hidden bg-[#FAF7F4] border border-[#E3DAD1] flex-shrink-0 flex items-center justify-center">
                  {banner.image_url ? (
                    <img src={banner.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={20} className="text-[#A08B7D]" />
                  )}
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-xs text-[#2A1C15] truncate">
                      {banner.title || "Untitled Banner"}
                    </h3>
                    {banner.mobile_image_url && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                        <Smartphone size={10} /> Mobile Banner
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#7A6658] line-clamp-1">{banner.subtitle}</p>
                  {banner.cta_text && (
                    <span className="text-[10px] text-[#8C532B] font-medium">
                      CTA: &quot;{banner.cta_text}&quot; ({banner.cta_link})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F0EAE3]">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    banner.is_active
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {banner.is_active ? "Active" : "Inactive"}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing(banner)}
                    className="p-2 hover:bg-[#FAF7F4] text-[#7A6658] hover:text-[#7C4D30] rounded-xl transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeletingId(banner.id)}
                    className="p-2 hover:bg-rose-50 text-[#7A6658] hover:text-rose-600 rounded-xl transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
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
        title="Delete Banner?"
        message="Are you sure you want to delete this hero banner? This action cannot be undone."
      />

      {/* Banner Add/Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#E3DAD1] space-y-5 no-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE4DC]">
              <h2 className="text-lg font-bold text-[#2A1C15]">
                {editing.id ? "Edit Banner" : "Add Banner"}
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
                  Banner Title <span className="text-[11px] font-normal text-[#A08B7D]">(Press Enter for line break)</span>
                </label>
                <textarea
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  rows={2}
                  placeholder={"Freshly Baked\nMade for Moments"}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">Subtitle</label>
                <textarea
                  value={editing.subtitle ?? ""}
                  onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader
                  label="Desktop Image (Landscape)"
                  value={editing.image_url ?? ""}
                  onChange={(url) => setEditing({ ...editing, image_url: url })}
                  folder="banners"
                />
                <ImageUploader
                  label="Mobile Image (Portrait / Square)"
                  value={editing.mobile_image_url ?? ""}
                  onChange={(url) => setEditing({ ...editing, mobile_image_url: url })}
                  folder="banners"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">Button Text</label>
                  <input
                    type="text"
                    value={editing.cta_text ?? ""}
                    onChange={(e) => setEditing({ ...editing, cta_text: e.target.value })}
                    placeholder="e.g. Order Now"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">Button Link</label>
                  <input
                    type="text"
                    value={editing.cta_link ?? ""}
                    onChange={(e) => setEditing({ ...editing, cta_link: e.target.value })}
                    placeholder="e.g. /products"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30]"
                  />
                </div>
              </div>

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
                Save Banner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

