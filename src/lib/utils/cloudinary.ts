/**
 * Helper to automatically inject format (f_auto), quality (q_auto), and width parameters
 * into Cloudinary URLs to minimize image byte sizes and save Cloudinary bandwidth.
 */
export function getOptimizedCloudinaryUrl(
  url: string | null | undefined,
  width = 800,
  quality = "auto"
): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // Only transform Cloudinary URLs
  if (!trimmed.includes("res.cloudinary.com")) return trimmed;

  // Check if transformation is already present
  const uploadIndex = trimmed.indexOf("/upload/");
  if (uploadIndex === -1) return trimmed;

  const prefix = trimmed.substring(0, uploadIndex + 8);
  const suffix = trimmed.substring(uploadIndex + 8);

  // If suffix already has format or width parameters, return as is
  if (suffix.startsWith("f_auto") || suffix.startsWith("w_") || suffix.startsWith("q_")) {
    return trimmed;
  }

  return `${prefix}f_auto,q_${quality},w_${width},c_limit/${suffix}`;
}
