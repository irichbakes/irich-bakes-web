import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, Star, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { getAllSettings } from "@/lib/api/settings";

export const metadata: Metadata = {
  title: "About Us | iRich Bakes",
  description:
    "Learn about iRich Bakes — our story, values, and commitment to crafting fresh bakes with quality ingredients.",
};

export default async function AboutPage() {
  const settings = await getAllSettings();

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#2A1C15]">
      {/* Hero Section */}
      <section className="relative bg-[#251811] text-white overflow-hidden border-b border-[#3C281D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#C4A882] text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Fresh Bakery</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                style={{ fontFamily: "'Instrument Sans', sans-serif" }}
              >
                Baked with care. Made for moments.
              </h1>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                At <strong className="text-white font-semibold">{settings.site_name}</strong>, we believe every moment deserves a special treat. We craft fresh, 100% preservative-free bakes using real butter and pure ingredients.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#7C4D30] hover:bg-[#633B23] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <span>Shop Our Bakes</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-white/15 bg-[#3C2415] aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] group">
                <Image
                  src="/about-hero.png"
                  alt="Master Baker at iRich Bakes"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-white/20 flex items-center justify-between text-[#2A1C15]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                      <UtensilsCrossed size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Expert Master Bakers</p>
                      <p className="text-[10px] text-[#7A6658]">Pure Butter & Real Ingredients</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <span className="text-xs font-bold text-amber-800">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Highlights Bar */}
      <section className="bg-white border-b border-[#EBE4DC] py-6 sm:py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: "Preservative Free", value: "100%" },
              { label: "Happy Customers", value: "10,000+" },
              { label: "Special Recipes", value: "50+" },
              { label: "Order Freshness", value: "Same-Day" },
            ].map((stat, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#FAF7F4] border border-[#E3DAD1]">
                <p className="text-xl sm:text-2xl font-bold text-[#7C4D30]">{stat.value}</p>
                <p className="text-xs text-[#7A6658] font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* Who We Are */}
        <section className="space-y-4">
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#2A1C15]"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          >
            Who We Are
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            At {settings.site_name}, born from a passion for baking and a commitment to quality, we craft fresh bakes using only the finest ingredients — no preservatives, no shortcuts, just pure goodness in every bite.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            From our bakery in Kerala, we deliver freshly baked cookies, cakes, muffins, and more straight to your doorstep. Every product is made fresh to order, ensuring you experience the warmth and taste of fresh baking.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#EBE4DC] text-xs font-semibold text-[#3C2415]">
              <CheckCircle2 size={16} className="text-[#7C4D30] flex-shrink-0" />
              <span>Real Butter & Pure Cocoa</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#EBE4DC] text-xs font-semibold text-[#3C2415]">
              <CheckCircle2 size={16} className="text-[#7C4D30] flex-shrink-0" />
              <span>Fresh Batch Baking</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#EBE4DC] text-xs font-semibold text-[#3C2415]">
              <CheckCircle2 size={16} className="text-[#7C4D30] flex-shrink-0" />
              <span>Moisture-Sealed Fresh Packing</span>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="space-y-4">
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#2A1C15]"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          >
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Freshness First", desc: "Every order is baked fresh — we never use pre-made or stored products." },
              { title: "Quality Ingredients", desc: "Premium butter, real chocolate, organic flour — only the best goes into our bakes." },
              { title: "Made with Love", desc: "Small batches, big love. Every product is handcrafted with attention to detail." },
              { title: "Customer Happiness", desc: "Your satisfaction is our priority. We go the extra mile to make every order special." },
            ].map((val) => (
              <div key={val.title} className="bg-white rounded-2xl p-5 border border-[#EBE4DC] shadow-2xs space-y-1.5">
                <h3 className="text-sm font-bold text-[#3C2415]">{val.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <div className="rounded-2xl bg-[#3C2415] text-white p-6 sm:p-8 text-center space-y-4 shadow-md">
          <h3 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            Ready to order freshly baked treats?
          </h3>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C4D30] hover:bg-[#633B23] text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
          >
            <span>Browse Shop Catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
