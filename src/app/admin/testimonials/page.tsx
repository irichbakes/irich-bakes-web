"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Testimonial } from "@/lib/types/database";

const emptyTestimonial: Partial<Testimonial> = { customer_name: "", location: "", content: "", rating: 5, sort_order: 0, is_active: true };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setItems((data as Testimonial[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!editing || !editing.customer_name || !editing.content) { toast.error("Name and content required"); return; }
    try {
      if (editing.id) {
        const { error } = await supabase.from("testimonials").update(editing).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert(editing);
        if (error) throw error;
      }
      toast.success("Saved"); setEditing(null); fetchData();
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    toast.success("Deleted"); fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <button onClick={() => setEditing({ ...emptyTestimonial })} className="flex items-center gap-2 px-4 py-2 bg-[#3C2415] text-white text-sm font-medium rounded-lg hover:bg-[#2A1A0E]"><Plus size={16} /> Add</button>
      </div>

      {loading ? <div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-xl" />)}</div>
      : items.length === 0 ? <p className="text-gray-500 text-center py-12">No testimonials yet.</p>
      : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{item.customer_name}</span>
                    {item.location && <span className="text-xs text-gray-500">— {item.location}</span>}
                  </div>
                  <div className="flex gap-0.5 mb-2">{Array.from({ length: item.rating }, (_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}</div>
                  <p className="text-sm text-gray-600 line-clamp-2">&ldquo;{item.content}&rdquo;</p>
                </div>
                <div className="flex gap-1 ml-4">
                  <button onClick={() => setEditing(item)} className="p-2 hover:bg-gray-100 rounded-lg"><Pencil size={14} className="text-gray-500" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red-500" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editing.id ? "Edit" : "Add"} Testimonial</h2>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label><input type="text" value={editing.customer_name ?? ""} onChange={(e) => setEditing({ ...editing, customer_name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47]" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} placeholder="e.g. Kochi" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47]" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Review *</label><textarea value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47] resize-none" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Rating</label><select value={editing.rating ?? 5} onChange={(e) => setEditing({ ...editing, rating: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8B6F47]">{[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Sort</label><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47]" /></div>
                <div className="flex items-end"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="w-4 h-4 rounded" /><span className="text-sm">Active</span></label></div>
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
