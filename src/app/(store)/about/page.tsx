import type { Metadata } from "next";
import { getAllSettings } from "@/lib/api/settings";

export const metadata: Metadata = {
  title: "About Us | iRich Bakes",
  description: "Learn about iRich Bakes — our story, values, and commitment to crafting premium homemade bakes with love.",
};

export default async function AboutPage() {
  const settings = await getAllSettings();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#F5F0EB] to-[#EDE3D7] py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#3C2415] mb-4" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            Our Story
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {settings.tagline}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
        {/* Mission */}
        <section>
          <h2 className="text-2xl font-bold text-[#3C2415] mb-4" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            Who We Are
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            At {settings.site_name}, we believe that every moment deserves a special treat. Born from a passion for baking and a commitment to quality, we craft premium homemade bakes using only the finest ingredients — no preservatives, no shortcuts, just pure love in every bite.
          </p>
          <p className="text-gray-600 leading-relaxed">
            From our kitchen in Kerala, we deliver freshly baked cookies, cakes, muffins, and more to your doorstep. Every product is made fresh to order, ensuring you experience the warmth and goodness of homemade baking.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-2xl font-bold text-[#3C2415] mb-6" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "Freshness First", desc: "Every order is baked fresh — we never use pre-made or stored products." },
              { title: "Quality Ingredients", desc: "Premium butter, real chocolate, organic flour — only the best goes into our bakes." },
              { title: "Made with Love", desc: "Small batches, big love. Every product is handcrafted with attention to detail." },
              { title: "Customer Happiness", desc: "Your satisfaction is our priority. We go the extra mile to make every order special." },
            ].map((value) => (
              <div key={value.title} className="bg-[#FAF7F4] rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-[#3C2415] mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
