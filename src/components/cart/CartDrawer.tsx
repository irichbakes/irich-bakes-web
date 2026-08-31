"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle, ArrowRight, ShieldCheck } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { useCartStore } from "@/store/cart";
import { formatPrice, generateOrderNumber } from "@/lib/utils/formatters";
import { buildWhatsAppMessage, getWhatsAppUrl } from "@/lib/utils/whatsapp";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface CartDrawerProps {
  whatsappNumber: string;
}

export default function CartDrawer({ whatsappNumber }: CartDrawerProps) {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on ESC key and prevent body scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  if (!mounted) return null;

  const total = getTotal();
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Please enter your name and phone number to continue");
      return;
    }

    setIsSubmitting(true);
    try {
      // Record order in Supabase
      const supabase = createClient();
      const orderNumber = generateOrderNumber();
      await supabase.from("orders").insert({
        order_number: orderNumber,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        items: items,
        total_amount: total,
        notes: `${customerAddress ? `Address: ${customerAddress}` : ""}${notes ? `. Notes: ${notes}` : ""}`,
      });

      // Generate WhatsApp order message
      const message = buildWhatsAppMessage({
        items,
        total,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      const whatsappUrl = getWhatsAppUrl(whatsappNumber, message);
      window.open(whatsappUrl, "_blank");

      clearCart();
      closeCart();
      toast.success("Order sent! Complete your order on WhatsApp.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Slide-over panel */}
      <div
        className={`fixed inset-y-0 right-0 max-w-full flex pl-10 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#FAF7F4]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#3C2415] text-white flex items-center justify-center">
                <ShoppingBag size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#3C2415] leading-tight">
                  Your Cart
                </h2>
                <p className="text-xs text-gray-500">
                  {totalCount === 0 ? "Empty" : `${totalCount} item${totalCount > 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="w-9 h-9 rounded-full bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors border border-gray-200"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Banner notification */}
          <div className="bg-[#FAF0E6] px-4 py-2 text-xs text-[#8B6F47] flex items-center justify-between border-b border-[#E8DCCF]">
            <span className="font-medium">✦ Freshly baked to order · Delivered across Kerala</span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F5F0EB] flex items-center justify-center text-[#8B6F47] mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="text-base font-semibold text-[#3C2415] mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-gray-500 mb-6 max-w-xs">
                  Discover our freshly baked handmade cakes, cookies, and treats.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3C2415] text-white text-xs font-semibold rounded-full hover:bg-[#2A1A0E] transition-colors"
                >
                  Explore Menu
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4 py-1">
                {items.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex gap-3.5 items-center group py-2"
                  >
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#F5F0EB] flex-shrink-0 border border-gray-100">
                      <ImageWithFallback
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#3C2415] truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatPrice(item.price)} each
                      </p>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold text-[#3C2415]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#3C2415]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.product_id)}
                            className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer / Fast Checkout Section */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 bg-[#FAF7F4] p-4 sm:p-5 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="text-lg font-bold text-[#3C2415]">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Checkout Form */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#8B6F47] transition placeholder:text-gray-400"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#8B6F47] transition placeholder:text-gray-400"
                  />
                </div>

                {showAddressFields ? (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <input
                      type="text"
                      placeholder="Delivery Address / City (optional)"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#8B6F47] transition placeholder:text-gray-400"
                    />
                    <textarea
                      placeholder="Special Instructions / Delivery Date (optional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#8B6F47] transition placeholder:text-gray-400 resize-none"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddressFields(true)}
                    className="text-xs text-[#8B6F47] hover:underline font-medium block text-left"
                  >
                    + Add delivery address & notes
                  </button>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all disabled:opacity-50"
              >
                <MessageCircle size={17} />
                {isSubmitting ? "Processing..." : `Order on WhatsApp · ${formatPrice(total)}`}
              </button>

              {/* View Full Cart Link */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1 text-gray-400">
                  <ShieldCheck size={14} className="text-green-600" />
                  Verified WhatsApp Checkout
                </span>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="font-medium text-[#3C2415] hover:text-[#8B6F47] hover:underline transition-colors"
                >
                  View Full Cart →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
