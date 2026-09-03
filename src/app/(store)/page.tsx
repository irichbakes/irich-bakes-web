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
import { getAllSettings } from "@/lib/api/settings";

export default async function HomePage() {
  const [banners, categories, bestSellers, occasions, testimonials, settings] =
    await Promise.all([
      getActiveBanners(),
      getActiveCategories(),
      getBestSellers(),
      getActiveOccasions(),
      getActiveTestimonials(),
      getAllSettings(),
    ]);

  return (
    <>
      <HeroBanner banners={banners} whatsappNumber={settings.whatsapp_number} />
      <CategoryGrid categories={categories} />
      <BestSellers products={bestSellers} />
      <FeatureStrip />
      <OccasionsSection occasions={occasions} />
      <TestimonialsCarousel testimonials={testimonials} />
    </>
  );
}
