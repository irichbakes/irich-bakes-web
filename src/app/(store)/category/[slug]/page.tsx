import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveCategories, getCategoryBySlug } from "@/lib/api/categories";
import { getProductsByCategory } from "@/lib/api/products";
import ProductGrid from "@/components/product/ProductGrid";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const categories = await getActiveCategories();
    return categories.map((cat) => ({ slug: cat.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} | iRich Bakes`,
    description: category.description || `Browse our ${category.name} collection`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.id);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#F5F0EB] to-[#EDE3D7] py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {category.image_url && (
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-white shadow-lg flex-shrink-0">
                <ImageWithFallback
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            )}
            <div className="text-center md:text-left">
              <nav className="text-sm text-gray-500 mb-2">
                <Link href="/" className="hover:text-[#8B6F47]">Home</Link>
                <span className="mx-2">/</span>
                <Link href="/shop" className="hover:text-[#8B6F47]">Shop</Link>
                <span className="mx-2">/</span>
                <span className="text-[#3C2415]">{category.name}</span>
              </nav>
              <h1 className="text-3xl md:text-4xl font-bold text-[#3C2415]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-600 mt-2">{category.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <p className="text-sm text-gray-500 mb-6">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
