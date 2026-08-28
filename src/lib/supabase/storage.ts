import { compressImage } from "@/lib/utils/imageCompressor";

export async function uploadImage(
  file: File,
  folder: string
): Promise<string> {
  // 1. Compress image in the browser first
  const compressedFile = await compressImage(file, {
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 0.82,
    mimeType: "image/webp",
  });

  // 2. Upload compressed image to Cloudinary via server API route
  const formData = new FormData();
  formData.append("file", compressedFile);
  formData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to upload image to Cloudinary");
  }

  // Returns Cloudinary secure URL (which will then be saved in Supabase database tables)
  return data.url;
}

export async function deleteImage(url: string): Promise<void> {
  // Cloudinary image deletion can be handled via admin API if required
  if (!url) return;
}

export function getPlaceholderUrl(): string {
  return "/placeholder.svg";
}
