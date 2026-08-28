export const PLACEHOLDER_IMAGE = "/placeholder.svg";

export const SITE_DEFAULTS = {
  name: "iRich Bakes",
  tagline: "Baked with care. Made for moments.",
  whatsapp: "+916238123456",
  currency: "₹",
  announcement: "✦ Freshly baked to order · Delivered across Kerala",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};
