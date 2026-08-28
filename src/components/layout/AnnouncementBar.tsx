import { MessageCircle } from "lucide-react";

interface AnnouncementBarProps {
  text?: string;
  whatsappNumber?: string;
}

export default function AnnouncementBar({ text, whatsappNumber }: AnnouncementBarProps) {
  const defaultText = "✦ Freshly baked to order · Delivered across Kerala";
  const content = text && text !== "Freshly baked with love. Delivering happiness across Kerala."
    ? (text.startsWith("✦") ? text : `✦ ${text}`)
    : defaultText;

  return (
    <div className="bg-[#2E1A0F] text-white text-xs py-2 px-4 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-gray-200 tracking-wide font-normal">
          {content}
        </p>
        {whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-[#C4A882] hover:text-white transition-colors font-medium"
          >
            <MessageCircle size={14} />
            <span>WhatsApp Us: {whatsappNumber}</span>
          </a>
        )}
      </div>
    </div>
  );
}
