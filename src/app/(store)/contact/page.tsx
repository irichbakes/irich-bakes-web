import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { getAllSettings } from "@/lib/api/settings";

export const metadata: Metadata = {
  title: "Contact Us | iRich Bakes",
  description:
    "Get in touch with iRich Bakes. Reach us via WhatsApp, phone, or email for orders, enquiries, and more.",
};

export default async function ContactPage() {
  const settings = await getAllSettings();

  const whatsappNumber = settings.whatsapp_number || settings.phone || "+919995802824";
  const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");

  const contactItems = [
    {
      icon: Phone,
      label: "Phone",
      value: settings.phone || "+91 9995802824",
      href: `tel:${settings.phone || "+919995802824"}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: settings.email || "hello@irichbakes.co.in",
      href: `mailto:${settings.email || "hello@irichbakes.co.in"}`,
    },
    {
      icon: MapPin,
      label: "Address",
      value: settings.address || "Kochi, Kerala, India",
      href: null,
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: settings.working_hours || "Mon - Sun: 9:00 AM - 8:00 PM",
      href: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F4] text-[#2A1C15]">
      {/* Hero */}
      <section className="bg-[#251811] text-white py-12 md:py-16 border-b border-[#3C281D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          >
            Get in Touch
          </h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            We&apos;d love to hear from you. Reach out for orders, enquiries, or just to say hello!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Contact Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE4DC] shadow-2xs space-y-6">
            <h2
              className="text-xl font-bold text-[#2A1C15]"
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            >
              Contact Information
            </h2>

            <div className="space-y-5">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#FAF7F4] text-[#7C4D30] border border-[#E3DAD1] flex items-center justify-center flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#8C7567]">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-bold text-[#2A1C15] hover:text-[#7C4D30] transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-bold text-[#2A1C15]">{item.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WhatsApp CTA Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE4DC] shadow-2xs flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <MessageCircle size={32} />
            </div>

            <div className="space-y-1.5">
              <h3
                className="text-xl font-bold text-[#2A1C15]"
                style={{ fontFamily: "'Instrument Sans', sans-serif" }}
              >
                Order on WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-[#7A6658] leading-relaxed max-w-xs mx-auto">
                The quickest way to place an order or ask us anything. We&apos;re just a message away!
              </p>
            </div>

            <div className="pt-2 w-full">
              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle size={18} />
                <span>Chat with Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
