"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, Check, RotateCcw, Calendar, Filter } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import CustomSelect from "@/components/ui/CustomSelect";
import type { Product, Category, Occasion } from "@/lib/types/database";

interface ShopContentProps {
  products: Product[];
  categories: Category[];
  occasions?: Occasion[];
}

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
  { value: "newest", label: "Newest First" },
];

function ShopContentInner({ products, categories, occasions = [] }: ShopContentProps) {
  const searchParams = useSearchParams();
  const occasionQuery = searchParams.get("occasion");

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync URL searchParam 'occasion' on mount or param change
  useEffect(() => {
    if (occasionQuery) {
      const matched = occasions.find(
        (o) => o.slug.toLowerCase() === occasionQuery.toLowerCase() || o.id === occasionQuery
      );
      if (matched) {
        setSelectedOccasion(matched.id);
      } else {
        setSelectedOccasion(occasionQuery);
      }
    }
  }, [occasionQuery, occasions]);

  // Lock body scroll when mobile bottom sheet is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterOpen]);

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedOccasion !== "all" ? 1 : 0) +
    (sortBy !== "default" ? 1 : 0);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category_id === selectedCategory);
    }

    // Filter by occasion with robust fallback matching
    if (selectedOccasion !== "all") {
      const targetQuery = selectedOccasion.toLowerCase();
      const targetOccasionObj = occasions.find(
        (o) => o.id.toLowerCase() === targetQuery || o.slug.toLowerCase() === targetQuery
      );

      const validTargets = new Set<string>();
      validTargets.add(targetQuery);
      if (targetOccasionObj) {
        validTargets.add(targetOccasionObj.id.toLowerCase());
        validTargets.add(targetOccasionObj.slug.toLowerCase());
      }

      result = result.filter((p) => {
        if (!p) return false;
        const pOccId = p.occasion_id?.toLowerCase();
        const pOccSlug = p.occasion?.slug?.toLowerCase();
        const pOccObjId = p.occasion?.id?.toLowerCase();

        return (
          (pOccId && validTargets.has(pOccId)) ||
          (pOccSlug && validTargets.has(pOccSlug)) ||
          (pOccObjId && validTargets.has(pOccObjId))
        );
      });
    }

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "price_low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        result = [...result].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    return result;
  }, [products, selectedCategory, selectedOccasion, searchQuery, sortBy, occasions]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedOccasion("all");
    setSortBy("default");
    setSearchQuery("");
  };

  const activeCategoryName = useMemo(() => {
    if (selectedCategory === "all") return null;
    return categories.find((c) => c.id === selectedCategory)?.name || null;
  }, [selectedCategory, categories]);

  const activeOccasionName = useMemo(() => {
    if (selectedOccasion === "all") return null;
    return (
      occasions.find(
        (o) => o.id === selectedOccasion || o.slug.toLowerCase() === selectedOccasion.toLowerCase()
      )?.name || selectedOccasion
    );
  }, [selectedOccasion, occasions]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8 md:py-12">
      {/* Top Filter & Search Toolbar */}
      <div className="flex items-center gap-2.5 sm:gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47] focus:border-transparent transition shadow-sm"
          />
        </div>

        {/* Desktop Filter Dropdowns */}
        <div className="hidden md:flex items-center gap-3">
          {/* Category Dropdown */}
          <CustomSelect
            options={[
              { value: "all", label: "Category: All" },
              ...categories.map((c) => ({ value: c.id, label: `Category: ${c.name}` })),
            ]}
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
          />

          {/* Occasion Dropdown */}
          {occasions.length > 0 && (
            <CustomSelect
              options={[
                { value: "all", label: "Occasion: All" },
                ...occasions.map((o) => ({ value: o.id, label: `Occasion: ${o.name}` })),
              ]}
              value={selectedOccasion}
              onChange={(val) => setSelectedOccasion(val)}
            />
          )}

          {/* Sort Dropdown */}
          <CustomSelect
            options={sortOptions.map((opt) => ({
              value: opt.value,
              label: `Sort: ${opt.label}`,
            }))}
            value={sortBy}
            onChange={(val) => setSortBy(val)}
            align="right"
          />
        </div>

        {/* Mobile Compact Filter Button (Right Side of Search Bar) */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className={`md:hidden relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl border transition-all shadow-sm flex-shrink-0 cursor-pointer ${
            activeFiltersCount > 0
              ? "bg-[#3C2415] text-white border-[#3C2415]"
              : "bg-white text-[#3C2415] border-gray-200 hover:bg-gray-50 active:scale-95"
          }`}
          aria-label="Open filter menu"
        >
          <SlidersHorizontal size={17} />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C4A882] text-[#3C2415] text-[10px] flex items-center justify-center font-bold shadow-xs">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Active Filter Tags & Count Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-gray-500 mb-6 bg-[#FAF7F4] p-3 rounded-2xl border border-gray-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-[#3C2415]">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </span>

          {activeCategoryName && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3C2415] text-white font-medium text-xs shadow-xs">
              Category: {activeCategoryName}
              <button onClick={() => setSelectedCategory("all")} className="hover:text-amber-200">
                <X size={12} />
              </button>
            </span>
          )}

          {activeOccasionName && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B6F47] text-white font-medium text-xs shadow-xs">
              <Calendar size={12} /> Occasion: {activeOccasionName}
              <button onClick={() => setSelectedOccasion("all")} className="hover:text-amber-200">
                <X size={12} />
              </button>
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-[#8B6F47] hover:underline font-semibold text-xs ml-auto"
          >
            <RotateCcw size={13} />
            <span>Reset all filters</span>
          </button>
        )}
      </div>

      {/* Products Grid */}
      <ProductGrid products={filteredProducts} />

      {/* Mobile Sort & Filter Bottom Sheet Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsFilterOpen(false)}
          />

          {/* Drawer Container */}
          <div className="relative z-10 bg-white rounded-t-[28px] max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Grab Handle */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h3
                className="text-lg font-bold text-[#3C2415]"
                style={{ fontFamily: "'Instrument Sans', sans-serif" }}
              >
                Sort & Filter
              </h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Filter Body */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              {/* Category Filter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                      selectedCategory === "all"
                        ? "bg-[#3C2415] text-white shadow-sm"
                        : "bg-[#F5F0EB] text-[#3C2415] hover:bg-[#EDE3D7]"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                        selectedCategory === cat.id
                          ? "bg-[#3C2415] text-white shadow-sm"
                          : "bg-[#F5F0EB] text-[#3C2415] hover:bg-[#EDE3D7]"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion Filter */}
              {occasions.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#8B6F47] mb-3 block flex items-center gap-1">
                    <Calendar size={14} /> Occasion
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedOccasion("all")}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                        selectedOccasion === "all"
                          ? "bg-[#8B6F47] text-white shadow-sm"
                          : "bg-[#FAF0E6] text-[#8B6F47] hover:bg-[#F3E6D8]"
                      }`}
                    >
                      All Occasions
                    </button>
                    {occasions.map((occ) => (
                      <button
                        key={occ.id}
                        onClick={() => setSelectedOccasion(occ.id)}
                        className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                          selectedOccasion === occ.id
                            ? "bg-[#8B6F47] text-white shadow-sm"
                            : "bg-[#FAF0E6] text-[#8B6F47] hover:bg-[#F3E6D8]"
                        }`}
                      >
                        {occ.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sort Options */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 block">
                  Sort By
                </label>
                <div className="space-y-2">
                  {sortOptions.map((option) => {
                    const isSelected = sortBy === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-medium transition-all text-left ${
                          isSelected
                            ? "bg-[#2E1A0F] text-white shadow-md"
                            : "bg-[#F9F7F4] text-[#3C2415] hover:bg-[#F2ECE4] border border-gray-100"
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check size={16} className="text-[#C4A882]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-[#3C2415] font-semibold text-xs uppercase tracking-wider hover:bg-gray-100 active:scale-95 transition-all text-center"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-2 flex-grow py-3 px-5 rounded-xl bg-[#2E1A0F] hover:bg-[#1E110A] text-white font-semibold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all text-center"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopContent(props: ShopContentProps) {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-400">Loading shop...</div>}>
      <ShopContentInner {...props} />
    </Suspense>
  );
}
