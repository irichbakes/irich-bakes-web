"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import type { Category } from "@/lib/types/database";

interface CategoryGridProps {
  categories: Category[];
}

const ITEMS_PER_PAGE = 6;

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (categories.length === 0) return null;

  const needsPagination = categories.length > ITEMS_PER_PAGE;
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left → next page
        goToPage(Math.min(currentPage + 1, totalPages - 1));
      } else {
        // Swipe right → prev page
        goToPage(Math.max(currentPage - 1, 0));
      }
    }
  }, [currentPage, totalPages, goToPage]);

  // If 6 or fewer categories, render the original simple grid
  if (!needsPagination) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#3C2415] text-center mb-8 md:mb-10" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            Explore Our Bakes
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#8B6F47] hover:text-[#3C2415] transition-colors"
            >
              VIEW ALL PRODUCTS →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Paginated carousel for more than 6 categories
  const pages = Array.from({ length: totalPages }, (_, i) =>
    categories.slice(i * ITEMS_PER_PAGE, (i + 1) * ITEMS_PER_PAGE)
  );

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3C2415] text-center mb-8 md:mb-10" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
          Explore Our Bakes
        </h2>

        {/* Carousel container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentPage * 100}%)`,
            }}
          >
            {pages.map((pageCategories, pageIndex) => (
              <div
                key={pageIndex}
                className="w-full flex-shrink-0"
              >
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
                  {pageCategories.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Peek indicator — show a subtle gradient on the right edge to hint more content */}
          {currentPage < totalPages - 1 && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/90 to-transparent pointer-events-none md:hidden" />
          )}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === currentPage
                  ? "w-6 h-2.5 bg-[#8B6F47]"
                  : "w-2.5 h-2.5 bg-[#D4C4B0] hover:bg-[#8B6F47]/50"
              }`}
            />
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#8B6F47] hover:text-[#3C2415] transition-colors"
          >
            VIEW ALL PRODUCTS →
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryItem({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col items-center"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-[#F5F0EB] mb-3 ring-2 ring-transparent group-hover:ring-[#8B6F47] transition-all duration-300 group-hover:shadow-lg">
        <ImageWithFallback
          src={category.image_url}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="112px"
        />
      </div>
      <span className="text-xs sm:text-sm font-medium text-[#3C2415] text-center group-hover:text-[#8B6F47] transition-colors">
        {category.name}
      </span>
    </Link>
  );
}
