import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/api/products";
import { getActiveCategories } from "@/lib/api/categories";
import ShopContent from "./ShopContent";

import ImageWithFallback from "@/components/ui/ImageWithFallback";

export const metadata: Metadata = {
  title: "Shop | iRich Bakes",
  description: "Browse our complete collection of premium homemade bakes — cookies, cakes, muffins, and more.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getActiveProducts(),
    getActiveCategories(),
  ]);

  // Select showcase bakes for the banner
  const cakeProduct = products.find((p) => p.name.toLowerCase().includes("cake") && p.image_url) || products[0];
  const cookieProduct = products.find((p) => (p.name.toLowerCase().includes("cookie") || p.name.toLowerCase().includes("biscuit") || p.name.toLowerCase().includes("muffin")) && p.id !== cakeProduct?.id && p.image_url) || products[1];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#FBF6EE] via-[#F6EDE2] to-[#EFE1D2] border-b border-[#EAE0D3]">
        {/* Decorative botanical branch watermark in top-right background */}
        <div className="absolute right-2 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none overflow-hidden hidden md:block">
          <svg className="absolute -right-4 -top-6 w-80 h-80 text-[#8B6F47]" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M40 190 C60 130, 110 80, 180 20" strokeLinecap="round" />
            <path d="M120 90 C145 75, 160 95, 145 110 C130 110, 120 95, 120 90 Z" fill="currentColor" fillOpacity="0.1" />
            <path d="M95 125 C70 115, 60 135, 75 145 C90 145, 95 130, 95 125 Z" fill="currentColor" fillOpacity="0.1" />
            <path d="M150 55 C175 40, 185 60, 170 70 C155 70, 150 55, 150 55 Z" fill="currentColor" fillOpacity="0.1" />
            <path d="M70 160 C50 150, 45 170, 60 178 C72 178, 75 165, 70 160 Z" fill="currentColor" fillOpacity="0.1" />
          </svg>
        </div>

        {/* Ambient warm radial glow */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#F4D9C0]/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 md:py-14">
          <div className="flex flex-row items-center justify-between gap-4 md:gap-12">
            {/* Left Content */}
            <div className="text-left max-w-xl z-10">
              <h1
                className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#3C2415] tracking-tight leading-tight"
                style={{ fontFamily: "'Instrument Sans', sans-serif" }}
              >
                Our Bakes
              </h1>
              <p className="hidden md:block text-[#5A4535] text-sm sm:text-base md:text-lg leading-relaxed mt-2">
                Explore our full collection of freshly baked treats
              </p>
            </div>

            {/* Right Treats Visual Showcase */}
            {(cakeProduct?.image_url || cookieProduct?.image_url) && (
              <div className="relative flex items-center justify-end flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
                  {/* Primary Baked Good (e.g. Bundt Cake / Tea Cake) */}
                  {cakeProduct?.image_url && (
                    <div className="relative group">
                      <div className="w-16 h-16 sm:w-28 sm:h-28 md:w-52 md:h-52 rounded-full overflow-hidden bg-white/80 p-1 sm:p-2 md:p-2.5 shadow-md md:shadow-xl border border-white/90 md:border-2 transform hover:scale-105 transition-transform duration-300">
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                          <ImageWithFallback
                            src={cakeProduct.image_url}
                            alt={cakeProduct.name || "Freshly Baked Treat"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 64px, (max-width: 768px) 112px, 208px"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Secondary Baked Good (e.g. Chocolate Chip Cookies) */}
                  {cookieProduct?.image_url && (
                    <div className="relative group -ml-4 sm:-ml-6 md:-ml-10">
                      <div className="w-14 h-14 sm:w-24 sm:h-24 md:w-44 md:h-44 rounded-full overflow-hidden bg-white/80 p-1 sm:p-1.5 md:p-2.5 shadow-lg md:shadow-2xl border border-white/90 md:border-2 transform hover:scale-105 transition-transform duration-300">
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                          <ImageWithFallback
                            src={cookieProduct.image_url}
                            alt={cookieProduct.name || "Handcrafted Cookies"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 56px, (max-width: 768px) 96px, 176px"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <ShopContent products={products} categories={categories} />
    </div>
  );
}
