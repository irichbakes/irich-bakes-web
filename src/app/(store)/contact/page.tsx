import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { getAllSettings } from "@/lib/api/settings";

export const metadata: Metadata = {
  title: "Contact Us | iRich Bakes",
  description: "Get in touch with iRich Bakes. Reach us via WhatsApp, phone, or email for orders, enquiries, and more.",
};

export default async function ContactPage() {
  const settings = await getAllSettings();

  const contactItems = [
    { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.phone}` },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: "Address", value: settings.address, href: null },
    { icon: Clock, label: "Working Hours", value: settings.working_hours, href: null },
  ].filter((item) => item.value);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#F5F0EB] to-[#EDE3D7] py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#3C2415] mb-4" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            Get in Touch
          </h1>
          <p className="text-gray-600 text-lg">
            We&apos;d love to hear from you. Reach out for orders, enquiries, or just to say hello!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#3C2415]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
              Contact Information
            </h2>

            {contactItems.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#F5F0EB] flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-[#8B6F47]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-[#3C2415] font-medium hover:text-[#8B6F47] transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-[#3C2415] font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-[#FAF7F4] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <MessageCircle size={28} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#3C2415] mb-2" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
              Order on WhatsApp
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              The quickest way to place an order or ask us anything. We&apos;re just a message away!
            </p>
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={18} />
              Chat with Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
