import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { SiteSettings } from "@/lib/types/database";
import type { Category } from "@/lib/types/database";
import NewsletterForm from "./NewsletterForm";

interface FooterProps {
  settings: SiteSettings;
  categories: Category[];
}

export default function Footer({ settings, categories }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#3C2415] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="mb-5">
              <Link href="/" className="inline-block bg-white px-3.5 py-2 rounded-xl shadow-sm hover:opacity-95 transition-opacity">
                <Image
                  src="/irich-logo.png"
                  alt={settings.site_name || "iRich Bakes"}
                  width={140}
                  height={45}
                  className="h-8 md:h-9 w-auto object-contain"
                />
              </Link>
            </div>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              {settings.tagline || "Baked with care. Made for moments."}
            </p>
            <div className="flex gap-3">
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
              )}
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Facebook">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3h-4V6.5c0-.8.2-1.1 1-1.1h3V1h-4.3C10.5 1 9 2.5 9 5.5V8z" />
                  </svg>
                </a>
              )}
              {settings.social_youtube && (
                <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="YouTube">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107c.502-1.89.502-5.837.502-5.837s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop" className="text-sm text-gray-300 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              {settings.phone && (
                <li className="flex items-start gap-2.5">
                  <Phone size={14} className="text-[#C4A882] mt-0.5 flex-shrink-0" />
                  <a href={`tel:${settings.phone}`} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-start gap-2.5">
                  <Mail size={14} className="text-[#C4A882] mt-0.5 flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-[#C4A882] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{settings.address}</span>
                </li>
              )}
              {settings.working_hours && (
                <li className="flex items-start gap-2.5">
                  <Clock size={14} className="text-[#C4A882] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{settings.working_hours}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-sm text-gray-300 mb-4">
              Stay updated with our latest bakes and offers.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 text-center space-y-1">
          <p className="text-xs text-gray-400">
            © {currentYear} {settings.site_name || "iRich Bakes"}. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Crafted by{" "}
            <a
              href="https://www.ekodrix.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C4A882] hover:text-white font-medium transition-colors hover:underline underline-offset-2"
            >
              ekodrix
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
