"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";
import type { Banner } from "@/lib/types/database";

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
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchData = async () => {
    const { data } = await supabase.from("banners").select("*").order("sort_order");
    setBanners((data as Banner[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    try {
      if (editing.id) {
        const { error } = await supabase.from("banners").update(editing).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("banners").insert(editing);
        if (error) throw error;
      }
      toast.success("Banner saved");
      setEditing(null);
      fetchData();
    } catch {
      toast.error("Failed to save");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await supabase.from("banners").delete().eq("id", id);
    toast.success("Banner deleted");
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
        <button
          onClick={() => setEditing({ ...emptyBanner })}
          className="flex items-center gap-2 px-4 py-2 bg-[#3C2415] text-white text-sm font-medium rounded-lg hover:bg-[#2A1A0E] transition-colors"
        >
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-xl" />)}</div>
      ) : banners.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No banners yet. Add your first banner.</p>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
              {banner.image_url && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={banner.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">{banner.title || "Untitled"}</h3>
                  {banner.mobile_image_url && (
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full border border-amber-200 flex-shrink-0">
                      Mobile Image
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{banner.subtitle}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${banner.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {banner.is_active ? "Active" : "Inactive"}
              </span>
              <div className="flex gap-1">
                <button onClick={() => setEditing(banner)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Edit">
                  <Pencil size={16} className="text-gray-500" />
                </button>
                <button onClick={() => handleDelete(banner.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" aria-label="Delete">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editing.id ? "Edit Banner" : "Add Banner"}</h2>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-xs font-normal text-gray-400">(Press Enter to add a line break)</span>
                </label>
                <textarea
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  rows={2}
                  placeholder={"Freshly Baked\nMade for Moments"}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <textarea value={editing.subtitle ?? ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47] resize-none" />
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input type="text" value={editing.cta_text ?? ""} onChange={(e) => setEditing({ ...editing, cta_text: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                  <input type="text" value={editing.cta_link ?? ""} onChange={(e) => setEditing({ ...editing, cta_link: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47]" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#8B6F47] focus:ring-[#8B6F47]" />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-[#3C2415] text-white font-medium rounded-lg hover:bg-[#2A1A0E] transition-colors text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
