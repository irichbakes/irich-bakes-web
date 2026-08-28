import { OrderItem } from "@/lib/types/database";
import { formatPrice } from "./formatters";

interface WhatsAppOrderData {
  items: OrderItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  notes?: string;
}

export function buildWhatsAppMessage(data: WhatsAppOrderData): string {
  const itemLines = data.items
    .map(
      (item) =>
        `${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");

  const lines = [
    "🛒 *New Order from iRich Bakes*",
    "━━━━━━━━━━━━━━━━━━━",
    itemLines,
    "━━━━━━━━━━━━━━━━━━━",
    `*Total: ${formatPrice(data.total)}*`,
    "",
    `*Name:* ${data.customerName}`,
    `*Phone:* ${data.customerPhone}`,
  ];

  if (data.customerAddress) {
    lines.push(`*Address:* ${data.customerAddress}`);
  }

  if (data.notes) {
    lines.push(`*Notes:* ${data.notes}`);
  }

  return lines.join("\n");
}

export function getWhatsAppUrl(
  phoneNumber: string,
  message: string
): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function getWhatsAppEnquiryUrl(
  phoneNumber: string,
  productName: string
): string {
  const message = `Hi! I'm interested in *${productName}* from iRich Bakes. Could you share more details?`;
  return getWhatsAppUrl(phoneNumber, message);
}

export function getWhatsAppDirectBuyUrl(
  phoneNumber: string,
  product: {
    name: string;
    price: number;
    image_url?: string;
    weight?: string;
  },
  quantity: number
): string {
  const total = product.price * quantity;
  const lines = [
    "🎂 *New Order Request — iRich Bakes*",
    "━━━━━━━━━━━━━━━━━━━",
    `*Product:* ${product.name}`,
    `*Quantity:* ${quantity}`,
    `*Price:* ${formatPrice(product.price)}${quantity > 1 ? ` each` : ""}`,
    `*Total:* ${formatPrice(total)}`,
  ];

  if (product.weight) {
    lines.push(`*Weight:* ${product.weight}`);
  }

  if (product.image_url) {
    lines.push("");
    lines.push(`*Image:* ${product.image_url}`);
  }

  lines.push("━━━━━━━━━━━━━━━━━━━");
  lines.push("Please confirm my order and share delivery/payment details. Thank you!");

  return getWhatsAppUrl(phoneNumber, lines.join("\n"));
}
