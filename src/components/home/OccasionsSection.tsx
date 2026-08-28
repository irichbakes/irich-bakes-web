import Link from "next/link";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import type { Occasion } from "@/lib/types/database";

interface OccasionsSectionProps {
  occasions: Occasion[];
}

export default function OccasionsSection({ occasions }: OccasionsSectionProps) {
  if (occasions.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-[#FAF7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-center">
          {/* Left text */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#3C2415] mb-3" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
              Made for Moments
            </h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              From everyday cravings to special celebrations. We bake for every little moment.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-[#3C2415] text-[#3C2415] text-sm font-semibold rounded-full hover:bg-[#3C2415] hover:text-white transition-colors"
            >
              EXPLORE OCCASIONS →
            </Link>
          </div>

          {/* Right grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {occasions.map((occasion) => (
              <Link
                key={occasion.id}
                href={`/shop?occasion=${occasion.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-square"
              >
                <ImageWithFallback
                  src={occasion.image_url}
                  alt={occasion.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 200px"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
