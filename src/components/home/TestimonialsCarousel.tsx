"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types/database";

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, testimonials.length]);

  if (testimonials.length === 0) return null;

  const testimonial = testimonials[current];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3C2415] mb-10" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
          Loved by Our Customers
        </h2>

        <div className="relative">
          {testimonials.length > 1 && (
            <button
              onClick={prev}
              className="absolute -left-2 md:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-md border border-gray-100 transition-colors z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          <div className="px-8 md:px-16">
            <div className="flex justify-center mb-4">
              <Quote size={32} className="text-[#C4A882] opacity-50" />
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: testimonial.rating }, (_, i) => (
                <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
              ))}
            </div>

            <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed mb-4 italic">
              &ldquo;{testimonial.content}&rdquo;
            </blockquote>

            <p className="font-semibold text-[#3C2415]">
              — {testimonial.customer_name}
              {testimonial.location && (
                <span className="font-normal text-gray-500">, {testimonial.location}</span>
              )}
            </p>
          </div>

          {testimonials.length > 1 && (
            <button
              onClick={next}
              className="absolute -right-2 md:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-md border border-gray-100 transition-colors z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        {/* Dots */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-[#3C2415]" : "bg-gray-300"
                  }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
