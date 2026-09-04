"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import type { Banner } from "@/lib/types/database";
import { SITE_DEFAULTS } from "@/lib/utils/constants";

interface HeroBannerProps {
  banners: Banner[];
  whatsappNumber?: string;
}

export default function HeroBanner({ banners, whatsappNumber }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  const cleanPhone = (whatsappNumber || SITE_DEFAULTS.whatsapp).replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}`;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % (banners.length || 1));
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + (banners.length || 1)) % (banners.length || 1));
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (banners.length === 0) {
    return (
      <section className="relative -mt-16 md:-mt-20 bg-[#FAF6F0] overflow-hidden min-h-[760px] sm:min-h-[820px] md:min-h-[640px] flex items-start md:items-center pt-24 sm:pt-28 md:pt-32 pb-16">
        <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-6 w-full py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <span className="hero-script text-3xl sm:text-4xl leading-none">Baked for</span>
              <span className="hero-script-line shrink-0" />
              <svg
                className="hero-script-heart shrink-0 rotate-[15deg]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B47A32"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h1 className="hero-heading text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold leading-[1.12] tracking-tight mb-2">
              <span className="text-[#0B1B32]">Good Moments,</span>
              <br />
              <span className="text-[#B47A32]">Everyday.</span>
            </h1>

            {/* Decorative leaf divider */}
            <div className="flex items-center gap-3 my-4 sm:my-5 max-w-[280px]">
              <div className="flex-1 h-[1px] bg-[#B47A32]/40" />
              <svg
                className="w-6 h-4 shrink-0 text-[#B47A32]"
                viewBox="0 0 28 18"
                fill="currentColor"
              >
                <path d="M14 16 C 13 12, 6 10, 3 3 C 8 3, 13 7, 14 16 Z" />
                <path d="M14 16 C 15 12, 22 10, 25 3 C 20 3, 15 7, 14 16 Z" />
              </svg>
              <div className="flex-1 h-[1px] bg-[#B47A32]/40" />
            </div>

            <p className="text-[#3A322D] text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-[290px] sm:max-w-xl leading-relaxed font-normal">
              Deliciously baked with the finest ingredients, crafted to bring joy to your everyday moments.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-[250px] sm:max-w-none">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 bg-[#0B1B32] hover:bg-[#071322] text-white font-medium rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-sm tracking-wide text-center"
              >
                Shop Our Bakes →
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#0B1B32] font-bold rounded-full border-2 border-[#0B1B32] shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-xs sm:text-sm tracking-wider text-center"
              >
                <MessageCircle size={16} className="text-[#0B1B32]" />
                ORDER ON WHATSAPP
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative -mt-16 md:-mt-20 overflow-hidden min-h-[760px] sm:min-h-[820px] md:min-h-[640px] lg:min-h-[680px] flex items-start md:items-center bg-[#FAF6F0]">
      {/* Background Images with crossfade */}
      {banners.map((banner, index) => {
        const isActive = index === current;
        return (
          <div
            key={banner.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-0 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
          >
            {banner.image_url || banner.mobile_image_url ? (
              <>
                {/* Desktop Image */}
                {banner.image_url && (
                  <ImageWithFallback
                    key={`desktop-${banner.image_url}`}
                    src={banner.image_url}
                    alt={banner.title || "Hero banner"}
                    fill
                    priority={index === 0}
                    className={`object-cover object-center ${banner.mobile_image_url ? "hidden md:block" : "block"}`}
                    sizes="100vw"
                    skipOptimization
                  />
                )}
                {/* Mobile Image */}
                {banner.mobile_image_url && (
                  <ImageWithFallback
                    key={`mobile-${banner.mobile_image_url}`}
                    src={banner.mobile_image_url}
                    alt={banner.title || "Hero banner mobile"}
                    fill
                    priority={index === 0}
                    className={`object-cover object-bottom md:object-center ${banner.image_url ? "block md:hidden" : "block"}`}
                    sizes="100vw"
                    skipOptimization
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#FAF6F0] to-[#F5EFEB]" />
            )}
          </div>
        );
      })}

      {/* Content for Current Banner */}
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-6 w-full pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-20">
        <div className="max-w-2xl text-left">
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <span className="hero-script text-3xl sm:text-4xl leading-none">Baked for</span>
            <span className="hero-script-line shrink-0" />
            <svg
              className="hero-script-heart shrink-0 rotate-[15deg]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B47A32"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <h1 className="hero-heading text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold leading-[1.12] tracking-tight mb-2">
            {banners[current]?.title ? (
              banners[current].title.split(/\r\n|\r|\n|<br\s*\/?>/gi).map((line, idx, arr) => (
                <span
                  key={idx}
                  className={idx === arr.length - 1 && arr.length > 1 ? "text-[#B47A32]" : "text-[#0B1B32]"}
                >
                  {line}
                  {idx < arr.length - 1 && <br />}
                </span>
              ))
            ) : (
              <>
                <span className="text-[#0B1B32]">Good Moments,</span>
                <br />
                <span className="text-[#B47A32]">Everyday.</span>
              </>
            )}
          </h1>

          {/* Decorative leaf divider */}
          <div className="flex items-center gap-3 my-4 sm:my-5 max-w-[280px]">
            <div className="flex-1 h-[1px] bg-[#B47A32]/40" />
            <svg
              className="w-6 h-4 shrink-0 text-[#B47A32]"
              viewBox="0 0 28 18"
              fill="currentColor"
            >
              <path d="M14 16 C 13 12, 6 10, 3 3 C 8 3, 13 7, 14 16 Z" />
              <path d="M14 16 C 15 12, 22 10, 25 3 C 20 3, 15 7, 14 16 Z" />
            </svg>
            <div className="flex-1 h-[1px] bg-[#B47A32]/40" />
          </div>

          <p className="text-[#3A322D] text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-[290px] sm:max-w-xl leading-relaxed font-normal">
            {banners[current]?.subtitle || "Deliciously baked with the finest ingredients, crafted to bring joy to your everyday moments."}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-[250px] sm:max-w-none">
            {banners[current]?.cta_text && banners[current]?.cta_link ? (
              <Link
                href={banners[current].cta_link!}
                className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 bg-[#0B1B32] hover:bg-[#071322] text-white font-medium rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-sm tracking-wide text-center"
              >
                {banners[current].cta_text} →
              </Link>
            ) : (
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 bg-[#0B1B32] hover:bg-[#071322] text-white font-medium rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-sm tracking-wide text-center"
              >
                Shop Our Bakes →
              </Link>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#0B1B32] font-bold rounded-full border-2 border-[#0B1B32] shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-xs sm:text-sm tracking-wider text-center"
            >
              <MessageCircle size={16} className="text-[#0B1B32]" />
              ORDER ON WHATSAPP
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white text-[#3C2415] backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-gray-100 hover:scale-105 active:scale-95 transition-all"
            aria-label="Previous banner"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white text-[#3C2415] backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-gray-100 hover:scale-105 active:scale-95 transition-all"
            aria-label="Next banner"
          >
            <ChevronRight size={22} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${i === current
                    ? "w-7 bg-[#3C2415]"
                    : "w-2.5 bg-[#3C2415]/30 hover:bg-[#3C2415]/60"
                  }`}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
