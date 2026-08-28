"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils/formatters";
import type { Product } from "@/lib/types/database";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square bg-[#F5F0EB] overflow-hidden">
          <ImageWithFallback
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {product.compare_price && product.compare_price > product.price && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-[#3C2415] mb-1 line-clamp-2 h-10 leading-snug group-hover:text-[#8B6F47] transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2 min-h-[2rem]">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-bold text-[#3C2415]">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#3C2415] text-white text-xs font-semibold rounded-lg hover:bg-[#2A1A0E] active:scale-[0.98] transition-all duration-200"
          >
            <ShoppingCart size={14} />
            ADD TO CART
          </button>
        </div>
      </div>
    </Link>
  );
}
