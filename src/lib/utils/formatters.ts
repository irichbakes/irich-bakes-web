export function formatPrice(amount: number, symbol = "₹"): string {
  return `${symbol}${amount.toLocaleString("en-IN")}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `IRB-${timestamp}-${random}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + "...";
}

export function cleanSettingValue(val: unknown): string {
  if (val === null || val === undefined) return "";
  let str =
    typeof val === "string"
      ? val.trim()
      : typeof val === "object"
      ? JSON.stringify(val)
      : String(val);

  // Strip wrapping double or single quotes if present (handles JSON-encoded / double-encoded strings)
  while (
    str.length >= 2 &&
    ((str.startsWith('"') && str.endsWith('"')) ||
      (str.startsWith("'") && str.endsWith("'")))
  ) {
    try {
      const parsed = JSON.parse(str);
      if (typeof parsed === "string") {
        str = parsed.trim();
      } else {
        str = str.slice(1, -1).trim();
      }
    } catch {
      str = str.slice(1, -1).trim();
    }
  }

  return str;
}

