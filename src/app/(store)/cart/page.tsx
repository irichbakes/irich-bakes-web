import type { Metadata } from "next";
import { getAllSettings } from "@/lib/api/settings";
import CartContent from "./CartContent";

export const metadata: Metadata = {
  title: "Cart | iRich Bakes",
  description: "Review your cart and place your order via WhatsApp.",
};

export default async function CartPage() {
  const settings = await getAllSettings();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-[#3C2415] mb-8" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
          Your Cart
        </h1>
        <CartContent whatsappNumber={settings.whatsapp_number} />
      </div>
    </div>
  );
}
