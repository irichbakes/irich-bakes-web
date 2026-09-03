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
      <section className="relative -mt-16 md:-mt-20 bg-gradient-to-r from-[#F5F0EB] to-[#EDE3D7] overflow-hidden min-h-[760px] sm:min-h-[820px] md:min-h-[640px] flex items-start md:items-center pt-24 sm:pt-28 md:pt-32 pb-16">
        <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-6 w-full py-12 md:py-16">
          <div className="max-w-2xl">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#3C2415] mb-2 sm:mb-3 leading-[1.15]"
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            >
              Freshly Baked.<br />Made for Moments.
            </h1>
            <p className="text-[#5A4535] text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-[290px] sm:max-w-xl leading-relaxed font-normal">
              Freshly baked cookies, cakes, and treats made with quality ingredients.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-[250px] sm:max-w-none">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 bg-[#2E1A0F] hover:bg-[#1E110A] text-white font-medium rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-sm tracking-wide text-center"
              >
                Shop Our Bakes →
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#3C2415] font-bold rounded-full border-2 border-[#3C2415] shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-xs sm:text-sm tracking-wider text-center"
              >
                <MessageCircle size={16} className="text-[#3C2415]" />
                ORDER ON WHATSAPP
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative -mt-16 md:-mt-20 overflow-hidden min-h-[760px] sm:min-h-[820px] md:min-h-[640px] lg:min-h-[680px] flex items-start md:items-center bg-[#F5F0EB]">
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
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#F5F0EB] to-[#EDE3D7]" />
            )}
          </div>
        );
      })}

      {/* Content for Current Banner */}
      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-6 w-full pt-24 sm:pt-28 md:pt-32 pb-16 md:pb-20">
        <div className="max-w-2xl text-left">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#3C2415] mb-2 sm:mb-3 leading-[1.15] tracking-tight whitespace-pre-line"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          >
            {banners[current]?.title ? (
              banners[current].title.split(/\r\n|\r|\n|<br\s*\/?>/gi).map((line, idx, arr) => (
                <span key={idx}>
                  {line}
                  {idx < arr.length - 1 && <br />}
                </span>
              ))
            ) : (
              <>Freshly Baked.<br />Made for Moments.</>
            )}
          </h1>

          <p className="text-[#5A4535] text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-[290px] sm:max-w-xl leading-relaxed font-normal">
            {banners[current]?.subtitle || "Freshly baked cookies, cakes, and treats made with quality ingredients."}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-[250px] sm:max-w-none">
            {banners[current]?.cta_text && banners[current]?.cta_link ? (
              <Link
                href={banners[current].cta_link!}
                className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 bg-[#2E1A0F] hover:bg-[#1E110A] text-white font-medium rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-sm tracking-wide text-center"
              >
                {banners[current].cta_text} →
              </Link>
            ) : (
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 bg-[#2E1A0F] hover:bg-[#1E110A] text-white font-medium rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-sm tracking-wide text-center"
              >
                Shop Our Bakes →
              </Link>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#3C2415] font-bold rounded-full border-2 border-[#3C2415] shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-xs sm:text-sm tracking-wider text-center"
            >
              <MessageCircle size={16} className="text-[#3C2415]" />
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
