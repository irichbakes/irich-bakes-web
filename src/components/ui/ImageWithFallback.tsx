"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/utils/constants";
import { getOptimizedCloudinaryUrl } from "@/lib/utils/cloudinary";

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
  fallback?: string;
  targetWidth?: number;
  /** When true, skips Cloudinary optimisation (f_auto, q_auto, w_*) entirely. */
  skipOptimization?: boolean;
}

export default function ImageWithFallback({
  src,
  fallback = PLACEHOLDER_IMAGE,
  alt,
  targetWidth = 800,
  unoptimized,
  skipOptimization = false,
  ...props
}: ImageWithFallbackProps) {
  const resolveUrl = (rawSrc: string | null | undefined) => {
    if (!rawSrc || rawSrc.trim() === "") return fallback;
    return skipOptimization ? rawSrc : getOptimizedCloudinaryUrl(rawSrc, targetWidth);
  };

  const [imgSrc, setImgSrc] = useState(() => resolveUrl(src));

  useEffect(() => {
    setImgSrc(resolveUrl(src));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, fallback, targetWidth, skipOptimization]);

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

