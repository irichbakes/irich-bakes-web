"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Grid3X3 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { generateSlug } from "@/lib/utils/formatters";
import toast from "react-hot-toast";
import type { Category } from "@/lib/types/database";

const emptyCategory: Partial<Category> = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  sort_order: 0,
  is_active: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = async () => {
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCategories((data as Category[]) ?? []);
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
    const slug = editing.slug || generateSlug(editing.name);
    const payload = { ...editing, slug };

    try {
      if (editing.id) {
        const { error } = await supabase.from("categories").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(payload);
        if (error) throw error;
      }
      toast.success("Category saved successfully");
      setEditing(null);
      fetchData();
    } catch {
      toast.error("Failed to save. Check slug uniqueness.");
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    await supabase.from("categories").delete().eq("id", deletingId);
    toast.success("Category deleted");
    setDeletingId(null);
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Header CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A1C15]">Categories</h1>
          <p className="text-xs text-[#7A6658] mt-0.5">
            Organize products into bakery sections and homepage categories.
          </p>
        </div>

        <button
          onClick={() => setEditing({ ...emptyCategory })}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7C4D30] hover:bg-[#633B23] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-[#EBE4DC] animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#EBE4DC] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F4] text-[#A08B7D] flex items-center justify-center mx-auto">
            <Grid3X3 size={24} />
          </div>
          <p className="text-sm font-semibold text-[#2A1C15]">No categories yet</p>
          <p className="text-xs text-[#8C7567]">Create your first product category to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-4 border border-[#EBE4DC] shadow-2xs hover:shadow-md transition-shadow flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#FAF7F4] border border-[#E3DAD1] flex-shrink-0 flex items-center justify-center">
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <Grid3X3 size={20} className="text-[#A08B7D]" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-[#2A1C15] truncate">{cat.name}</h3>
                  <p className="text-[11px] text-[#A08B7D] truncate">/{cat.slug}</p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      cat.is_active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {cat.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditing(cat)}
                  className="p-2 hover:bg-[#FAF7F4] text-[#7A6658] hover:text-[#7C4D30] rounded-xl transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeletingId(cat.id)}
                  className="p-2 hover:bg-rose-50 text-[#7A6658] hover:text-rose-600 rounded-xl transition-colors"
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
        title="Delete Category?"
        message="Are you sure you want to delete this category? Products in this category may be unassigned."
      />

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#E3DAD1] space-y-5 no-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE4DC]">
              <h2 className="text-lg font-bold text-[#2A1C15]">
                {editing.id ? "Edit Category" : "Add Category"}
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
                <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">Category Name *</label>
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

              <div>
                <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">Description</label>
                <textarea
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30] resize-none"
                />
              </div>

              <ImageUploader
                value={editing.image_url ?? ""}
                onChange={(url) => setEditing({ ...editing, image_url: url })}
                folder="categories"
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
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

