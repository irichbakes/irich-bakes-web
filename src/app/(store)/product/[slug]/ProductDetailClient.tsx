"use client";

import { useState } from "react";
import { ShoppingCart, MessageCircle, Minus, Plus } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils/formatters";
import { getWhatsAppDirectBuyUrl } from "@/lib/utils/whatsapp";
import type { Product } from "@/lib/types/database";
import toast from "react-hot-toast";

interface ProductDetailClientProps {
  product: Product;
  whatsappNumber: string;
}

export default function ProductDetailClient({ product, whatsappNumber }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const allImages = [product.image_url, ...(product.images || [])].filter(Boolean);

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    const url = getWhatsAppDirectBuyUrl(
      whatsappNumber,
      {
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        weight: product.weight,
      },
      quantity
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-square bg-[#F5F0EB] rounded-2xl overflow-hidden mb-4">
            <ImageWithFallback
              src={allImages[selectedImage] || product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {product.compare_price && product.compare_price > product.price && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    selectedImage === i ? "border-[#8B6F47]" : "border-transparent"
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <span className="text-xs font-medium text-[#8B6F47] uppercase tracking-wider">
              {product.category.name}
            </span>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-[#3C2415] mt-1 mb-3" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-[#3C2415]">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.long_description || product.description}
          </p>

          {product.weight && (
            <p className="text-sm text-gray-500 mb-6">
              <span className="font-medium">Weight:</span> {product.weight}
            </p>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#3C2415] hover:bg-[#2A1A0E] text-white font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
            >
              <ShoppingCart size={18} />
              ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
            >
              <MessageCircle size={18} />
              BUY NOW ON WHATSAPP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
