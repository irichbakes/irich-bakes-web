"use client";

import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/lib/types/database";

interface BestSellersProps {
  products: Product[];
}

export default function BestSellers({ products }: BestSellersProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-10">
          <p className="text-sm text-[#8B6F47] font-medium mb-2 tracking-wider uppercase">
            Loved by our customers. Bakes fresh for every occasion.
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#3C2415]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            Our Best Sellers
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#8B6F47] hover:text-[#3C2415] transition-colors"
          >
            VIEW ALL BEST SELLERS →
          </Link>
        </div>
      </div>
    </section>
  );
}
