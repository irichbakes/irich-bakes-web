import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import BestSellers from "@/components/home/BestSellers";
import FeatureStrip from "@/components/home/FeatureStrip";
import OccasionsSection from "@/components/home/OccasionsSection";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import { getActiveBanners } from "@/lib/api/banners";
import { getActiveCategories } from "@/lib/api/categories";
import { getBestSellers } from "@/lib/api/products";
import { getActiveOccasions } from "@/lib/api/occasions";
import { getActiveTestimonials } from "@/lib/api/testimonials";

export default async function HomePage() {
  const [banners, categories, bestSellers, occasions, testimonials] =
    await Promise.all([
      getActiveBanners(),
      getActiveCategories(),
      getBestSellers(),
      getActiveOccasions(),
      getActiveTestimonials(),
    ]);

  return (
    <>
      <HeroBanner banners={banners} />
      <CategoryGrid categories={categories} />
      <BestSellers products={bestSellers} />
      <FeatureStrip />
      <OccasionsSection occasions={occasions} />
      <TestimonialsCarousel testimonials={testimonials} />
    </>
  );
}
