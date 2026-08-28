"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils/formatters";
import { buildWhatsAppMessage, getWhatsAppUrl } from "@/lib/utils/whatsapp";
import { generateOrderNumber } from "@/lib/utils/formatters";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface CartContentProps {
  whatsappNumber: string;
}

export default function CartContent({ whatsappNumber }: CartContentProps) {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = getTotal();

  const handleCheckout = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      // Save order to database
      const supabase = createClient();
      const orderNumber = generateOrderNumber();
      await supabase.from("orders").insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        items: items,
        total_amount: total,
        notes: `${customerAddress ? `Address: ${customerAddress}` : ""}${notes ? `. Notes: ${notes}` : ""}`,
      });

      // Build WhatsApp message
      const message = buildWhatsAppMessage({
        items,
        total,
        customerName,
        customerPhone,
        customerAddress: customerAddress || undefined,
        notes: notes || undefined,
      });

      const whatsappUrl = getWhatsAppUrl(whatsappNumber, message);

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");

      // Clear cart
      clearCart();
      toast.success("Order sent! Check WhatsApp to complete your order.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-[#F5F0EB] flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={32} className="text-[#8B6F47]" />
        </div>
        <h2 className="text-xl font-semibold text-[#3C2415] mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven&apos;t added any bakes yet.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#3C2415] text-white font-semibold rounded-full hover:bg-[#2A1A0E] transition-colors"
        >
          Browse Our Bakes
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product_id}
            className="bg-white rounded-xl p-4 flex gap-4 border border-gray-100 shadow-sm"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F5F0EB] flex-shrink-0">
              <ImageWithFallback
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#3C2415] text-sm sm:text-base truncate">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {formatPrice(item.price)} each
              </p>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="Decrease"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="Increase"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#3C2415]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit sticky top-24">
        <h2 className="text-lg font-bold text-[#3C2415] mb-6" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
          Order Summary
        </h2>

        <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal ({items.length} items)</span>
            <span className="font-medium">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Delivery</span>
            <span className="text-green-600 font-medium">To be discussed</span>
          </div>
        </div>

        <div className="flex justify-between text-lg font-bold text-[#3C2415] mb-6">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        {/* Customer Details */}
        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Your Name *"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47] transition"
          />
          <input
            type="tel"
            placeholder="Phone Number *"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47] transition"
          />
          <input
            type="text"
            placeholder="Delivery Address"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47] transition"
          />
          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B6F47] transition resize-none"
          />
        </div>

        <button
          onClick={handleCheckout}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <MessageCircle size={18} />
          {isSubmitting ? "Sending..." : "Order via WhatsApp"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-3">
          Your order will be sent to our WhatsApp for confirmation.
        </p>
      </div>
    </div>
  );
}
