"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import type { Category } from "@/lib/types/database";

interface NavbarProps {
  categories: Category[];
  siteName: string;
}

export default function Navbar({ categories, siteName }: NavbarProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHomePage && !isScrolled;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop", hasDropdown: true },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/shop") return pathname === "/shop" || pathname.startsWith("/category/");
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent text-[#3C2415]"
          : "bg-white/95 backdrop-blur-md shadow-sm text-[#3C2415]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group flex items-center py-1">
            <Image
              src="/irich-logo.png"
              alt={siteName || "iRich Bakes"}
              width={140}
              height={45}
              className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return link.hasDropdown ? (
                <div
                  key={link.href}
                  className="relative py-2"
                  onMouseEnter={() => setShopOpen(true)}
                  onMouseLeave={() => setShopOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={`relative flex items-center gap-1.5 text-sm font-semibold transition-colors py-1 ${
                      active ? "text-[#7C4D30]" : "text-[#3C2415] hover:text-[#7C4D30]"
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        shopOpen ? "rotate-180" : ""
                      }`}
                    />
                    {active && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#7C4D30] rounded-full animate-in fade-in zoom-in-75 duration-200" />
                    )}
                  </Link>

                  {shopOpen && categories.length > 0 && (
                    <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2.5 animate-in fade-in slide-in-from-top-2 duration-200 text-gray-800">
                      <Link
                        href="/shop"
                        className={`block px-4 py-2.5 text-sm transition-colors font-semibold ${
                          pathname === "/shop"
                            ? "bg-[#FAF7F4] text-[#7C4D30]"
                            : "text-[#3C2415] hover:bg-[#F5F0EB]"
                        }`}
                      >
                        All Products
                      </Link>
                      <div className="h-px bg-gray-100 mx-3 my-1" />
                      {categories.map((cat) => {
                        const isCatActive = pathname === `/category/${cat.slug}`;
                        return (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isCatActive
                                ? "bg-[#FAF7F4] text-[#7C4D30] font-bold"
                                : "text-gray-600 hover:bg-[#F5F0EB] hover:text-[#3C2415]"
                            }`}
                          >
                            {cat.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-semibold transition-colors py-1 ${
                    active ? "text-[#7C4D30]" : "text-[#3C2415] hover:text-[#7C4D30]"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#7C4D30] rounded-full animate-in fade-in zoom-in-75 duration-200" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 md:gap-5">
            <button
              onClick={openCart}
              aria-label="Open cart drawer"
              className="relative flex items-center gap-1.5 transition-colors text-[#3C2415] hover:text-[#8B6F47]"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline text-sm font-medium">
                Cart {mounted && itemCount > 0 ? `(${itemCount})` : "(0)"}
              </span>
              {mounted && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 sm:hidden text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium shadow bg-[#8B6F47]">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-lg transition-colors text-[#3C2415] hover:bg-black/5"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white text-[#3C2415] border-t border-gray-100 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between py-3 font-semibold border-b border-gray-50 transition-colors px-2 rounded-xl ${
                      active ? "text-[#7C4D30] bg-[#FAF7F4]" : "text-[#3C2415]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#7C4D30]" />}
                  </Link>
                  {link.hasDropdown && categories.length > 0 && (
                    <div className="pl-4 py-1 space-y-1">
                      {categories.map((cat) => {
                        const isCatActive = pathname === `/category/${cat.slug}`;
                        return (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className={`block py-1.5 text-sm ${
                              isCatActive ? "text-[#7C4D30] font-bold" : "text-gray-600 hover:text-[#3C2415]"
                            }`}
                          >
                            {cat.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
