"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Search, Filter, Package, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { generateSlug, formatPrice } from "@/lib/utils/formatters";
import toast from "react-hot-toast";
import type { Product, Category } from "@/lib/types/database";
import CustomSelect from "@/components/ui/CustomSelect";

const emptyProduct: Partial<Product> = {
  name: "",
  slug: "",
  description: "",
  long_description: "",
  price: 0,
  compare_price: null,
  category_id: null,
  image_url: "",
  images: [],
  is_bestseller: false,
  is_active: true,
  rating: 0,
  review_count: 0,
  weight: "",
  sort_order: 0,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("all");

  const supabase = createClient();

  const fetchData = async () => {
    const [prodRes, catRes] = await Promise.all([
      supabase.from("products").select("*, category:categories(*)").order("sort_order"),
      supabase.from("categories").select("*").order("sort_order"),
    ]);
    setProducts((prodRes.data as Product[]) ?? []);
    setCategories((catRes.data as Category[]) ?? []);
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
    const { category, ...data } = editing;
    void category;
    const payload = { ...data, slug };

    try {
      if (editing.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
      toast.success("Product saved successfully");
      setEditing(null);
      fetchData();
    } catch {
      toast.error("Failed to save product");
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    await supabase.from("products").delete().eq("id", deletingId);
    toast.success("Product deleted");
    setDeletingId(null);
    fetchData();
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCat === "all" || p.category_id === selectedCat;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A1C15]">Products</h1>
          <p className="text-xs text-[#7A6658] mt-0.5">
            Manage product catalog, pricing, categories, and inventory.
          </p>
        </div>

        <button
          onClick={() => setEditing({ ...emptyProduct })}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7C4D30] hover:bg-[#633B23] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#EBE4DC] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A08B7D]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] outline-none focus:border-[#7C4D30]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-[#8C7567]" />
          <CustomSelect
            options={[
              { value: "all", label: "All Categories" },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
            value={selectedCat}
            onChange={(val) => setSelectedCat(val)}
            align="right"
          />
        </div>
      </div>

      {/* Table Container */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl border border-[#EBE4DC] animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#EBE4DC] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F4] text-[#A08B7D] flex items-center justify-center mx-auto">
            <Package size={24} />
          </div>
          <p className="text-sm font-semibold text-[#2A1C15]">No products found</p>
          <p className="text-xs text-[#8C7567]">Try adjusting your search filters or add a new product.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EBE4DC] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F4] border-b border-[#EBE4DC] text-[#7A6658] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5 hidden sm:table-cell">Category</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5 hidden md:table-cell">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE3]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF7F4]/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#FAF7F4] border border-[#E3DAD1] flex-shrink-0 flex items-center justify-center">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={18} className="text-[#A08B7D]" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#2A1C15] line-clamp-1">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {p.weight && <span className="text-[10px] text-[#8C7567]">{p.weight}</span>}
                            {p.is_bestseller && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                <Star size={10} className="fill-amber-500" /> Bestseller
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell text-[#5A4537]">
                      {p.category?.name ? (
                        <span className="px-2.5 py-1 bg-[#FAF7F4] border border-[#E3DAD1] rounded-lg text-xs font-medium">
                          {p.category.name}
                        </span>
                      ) : (
                        <span className="text-[#A08B7D]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#2A1C15]">{formatPrice(p.price)}</p>
                      {p.compare_price && (
                        <p className="text-[10px] text-[#A08B7D] line-through">
                          {formatPrice(p.compare_price)}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          p.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {p.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditing(p)}
                          className="p-2 hover:bg-[#FAF7F4] text-[#7A6658] hover:text-[#7C4D30] rounded-xl transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeletingId(p.id)}
                          className="p-2 hover:bg-rose-50 text-[#7A6658] hover:text-rose-600 rounded-xl transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
        title="Delete Product?"
        message="Are you sure you want to delete this product? This action will permanently remove it from your store catalog."
      />

      {/* Product Add/Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#E3DAD1] space-y-6 no-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE4DC]">
              <h2 className="text-lg font-bold text-[#2A1C15]">
                {editing.id ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="p-2 hover:bg-[#FAF7F4] text-[#8C7567] rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">Name *</label>
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">
                  Short Description
                </label>
                <textarea
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">
                  Long Description
                </label>
                <textarea
                  value={editing.long_description ?? ""}
                  onChange={(e) => setEditing({ ...editing, long_description: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editing.price ?? 0}
                    onChange={(e) =>
                      setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">
                    Compare Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editing.compare_price ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        compare_price: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">Weight</label>
                  <input
                    type="text"
                    value={editing.weight ?? ""}
                    onChange={(e) => setEditing({ ...editing, weight: e.target.value })}
                    placeholder="e.g. 250g"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#E3DAD1] rounded-xl text-xs text-[#2A1C15] focus:outline-none focus:border-[#7C4D30]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3528] mb-1.5">Category</label>
                <CustomSelect
                  options={[
                    { value: "", label: "No category" },
                    ...categories.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  value={editing.category_id ?? ""}
                  onChange={(val) =>
                    setEditing({ ...editing, category_id: val || null })
                  }
                  className="w-full"
                />
              </div>

              <ImageUploader
                value={editing.image_url ?? ""}
                onChange={(url) => setEditing({ ...editing, image_url: url })}
                folder="products"
              />

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.is_active ?? true}
                    onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-[#E3DAD1] text-[#7C4D30] focus:ring-[#7C4D30]"
                  />
                  <span className="text-xs font-semibold text-[#4A3528]">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.is_bestseller ?? false}
                    onChange={(e) => setEditing({ ...editing, is_bestseller: e.target.checked })}
                    className="w-4 h-4 rounded border-[#E3DAD1] text-[#7C4D30] focus:ring-[#7C4D30]"
                  />
                  <span className="text-xs font-semibold text-[#4A3528]">Bestseller</span>
                </label>
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
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

