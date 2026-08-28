import Link from "next/link";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import type { Category } from "@/lib/types/database";

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3C2415] text-center mb-8 md:mb-10" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
          Explore Our Bakes
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
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
