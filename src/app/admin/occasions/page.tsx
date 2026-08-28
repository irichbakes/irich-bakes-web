"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/components/admin/ImageUploader";
import { generateSlug } from "@/lib/utils/formatters";
import toast from "react-hot-toast";
import type { Occasion } from "@/lib/types/database";

const emptyOccasion: Partial<Occasion> = { name: "", slug: "", image_url: "", sort_order: 0, is_active: true };

export default function AdminOccasionsPage() {
  const [items, setItems] = useState<Occasion[]>([]);
  const [editing, setEditing] = useState<Partial<Occasion> | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = async () => {
    const { data } = await supabase.from("occasions").select("*").order("sort_order");
    setItems((data as Occasion[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!editing || !editing.name) { toast.error("Name is required"); return; }
    const payload = { ...editing, slug: editing.slug || generateSlug(editing.name) };
    try {
      if (editing.id) {
        const { error } = await supabase.from("occasions").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("occasions").insert(payload);
        if (error) throw error;
      }
      toast.success("Saved"); setEditing(null); fetchData();
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("occasions").delete().eq("id", id);
    toast.success("Deleted"); fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Occasions</h1>
        <button onClick={() => setEditing({ ...emptyOccasion })} className="flex items-center gap-2 px-4 py-2 bg-[#3C2415] text-white text-sm font-medium rounded-lg hover:bg-[#2A1A0E]">
          <Plus size={16} /> Add Occasion
        </button>
      </div>

      {loading ? <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-xl" />)}</div>
      : items.length === 0 ? <p className="text-gray-500 text-center py-12">No occasions yet.</p>
      : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
              {item.image_url && <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 mx-auto mb-3"><img src={item.image_url} alt="" className="w-full h-full object-cover" /></div>}
              <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
              <div className="flex gap-1 justify-center mt-2">
                <button onClick={() => setEditing(item)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil size={14} className="text-gray-500" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editing.id ? "Edit" : "Add"} Occasion</h2>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : generateSlug(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47]" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Slug</label><input type="text" value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47]" /></div>
              <ImageUploader value={editing.image_url ?? ""} onChange={(url) => setEditing({ ...editing, image_url: url })} folder="occasions" />
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47]" /></div>
                <div className="flex items-end"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="w-4 h-4 rounded" /><span className="text-sm font-medium text-gray-700">Active</span></label></div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-[#3C2415] text-white font-medium rounded-lg hover:bg-[#2A1A0E] text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
