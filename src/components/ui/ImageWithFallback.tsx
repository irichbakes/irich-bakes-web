"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/utils/constants";
import { getOptimizedCloudinaryUrl } from "@/lib/utils/cloudinary";

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
  fallback?: string;
  targetWidth?: number;
}

export default function ImageWithFallback({
  src,
  fallback = PLACEHOLDER_IMAGE,
  alt,
  targetWidth = 800,
  unoptimized,
  ...props
}: ImageWithFallbackProps) {
  const initialOptimized = src && src.trim() !== "" ? getOptimizedCloudinaryUrl(src, targetWidth) : fallback;
  const [imgSrc, setImgSrc] = useState(initialOptimized);

  useEffect(() => {
    const nextSrc = src && src.trim() !== "" ? getOptimizedCloudinaryUrl(src, targetWidth) : fallback;
    setImgSrc(nextSrc);
  }, [src, fallback, targetWidth]);

  const isCloudinary = typeof imgSrc === "string" && imgSrc.includes("res.cloudinary.com");

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      unoptimized={unoptimized !== undefined ? unoptimized : isCloudinary}
      onError={() => setImgSrc(fallback)}
    />
  );
}

