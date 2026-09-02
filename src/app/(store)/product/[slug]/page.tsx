import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveProducts, getProductBySlug, getRelatedProducts } from "@/lib/api/products";
import { getAllSettings } from "@/lib/api/settings";
import ProductDetailClient from "./ProductDetailClient";
import ProductGrid from "@/components/product/ProductGrid";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const products = await getActiveProducts();
    return products.map((prod) => ({ slug: prod.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | iRich Bakes`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getAllSettings(),
  ]);

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.category_id, product.id, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-[#8B6F47]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[#8B6F47]">Shop</Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/category/${product.category.slug}`} className="hover:text-[#8B6F47]">
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-[#3C2415]">{product.name}</span>
        </nav>
      </div>

      <ProductDetailClient product={product} whatsappNumber={settings.whatsapp_number} />

      {/* Suggested / Popular Items */}
      {relatedProducts.length > 0 && (
        <section className="bg-[#FAF7F4] py-14 md:py-20 mt-12 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 md:mb-10">
              <p className="text-xs uppercase tracking-widest font-semibold text-[#8B6F47] mb-2">
                Handcrafted Treats
              </p>
              <h2
                className="text-2xl md:text-3xl font-bold text-[#3C2415]"
                style={{ fontFamily: "'Instrument Sans', sans-serif" }}
              >
                You May Also Like
              </h2>
            </div>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        </section>
      )}
    </div>
  );
}
