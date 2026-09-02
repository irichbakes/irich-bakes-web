import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/api/products";
import { getActiveCategories } from "@/lib/api/categories";
import ShopContent from "./ShopContent";

export const metadata: Metadata = {
  title: "Shop | iRich Bakes",
  description: "Browse our complete collection of premium homemade bakes — cookies, cakes, muffins, and more.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getActiveProducts(),
    getActiveCategories(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <ShopContent products={products} categories={categories} />
    </div>
  );
}
