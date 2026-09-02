"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { uploadImage } from "@/lib/supabase/storage";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder,
  label = "Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please drop or select a valid image file");
        return;
      }

      setUploading(true);
      try {
        const url = await uploadImage(file, folder);
        onChange(url);
        toast.success("Image compressed & uploaded!");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Upload failed. Try again.";
        toast.error(message);
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [folder, onChange]
  );

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // 1. Files dropped directly from desktop/file manager
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
      return;
    }

    // 2. File items dropped from apps like WhatsApp or web browsers
    const items = e.dataTransfer.items;
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === "file") {
          const file = items[i].getAsFile();
          if (file) {
            await processFile(file);
            return;
          }
        }
      }
    }

    // 3. Image URL dropped from another browser tab or app
    const urlData =
      e.dataTransfer.getData("text/uri-list") ||
      e.dataTransfer.getData("text/plain");

    if (
      urlData &&
      (urlData.startsWith("http://") ||
        urlData.startsWith("https://") ||
        urlData.startsWith("data:image/"))
    ) {
      onChange(urlData.trim());
      toast.success("Image URL set from drop!");
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed overflow-hidden transition-all duration-200 ${
          isDragging
            ? "border-[#7C4D30] bg-[#7C4D30]/10 ring-4 ring-[#7C4D30]/20 scale-[1.01]"
            : "border-[#E3DAD1] hover:border-[#7C4D30] bg-[#FAF7F4]"
        }`}
      >
        {value ? (
          <div className="relative p-3 flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#E3DAD1] flex-shrink-0 bg-white shadow-2xs">
              <ImageWithFallback
                src={value}
                alt="Uploaded"
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5 w-full">
              <div>
                <p className="text-xs font-bold text-[#2A1C15]">Current Image</p>
                <p className="text-[11px] text-[#7A6658] truncate">
                  Drag a new image here to replace, or click below
                </p>
              </div>
              <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="px-2.5 py-1 text-xs font-semibold text-[#7C4D30] bg-white border border-[#7C4D30]/30 rounded-lg hover:bg-[#FAF7F4] transition-colors disabled:opacity-50 shadow-2xs"
                >
                  Change File
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors shadow-2xs"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Drag overlay on top of existing image */}
            {isDragging && (
              <div className="absolute inset-0 bg-[#251811]/85 backdrop-blur-xs rounded-xl flex items-center justify-center text-white text-xs font-medium z-10 animate-fade-in">
                Drop new image to replace
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="p-6 cursor-pointer flex flex-col items-center justify-center text-center group"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-7 h-7 border-2 border-[#8B6F47] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-500 font-medium">
                  Uploading & compressing...
                </span>
              </div>
            ) : (
              <>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors mb-2 ${
                    isDragging
                      ? "bg-[#8B6F47] text-white"
                      : "bg-white text-gray-400 group-hover:text-[#8B6F47] group-hover:bg-[#8B6F47]/10 shadow-xs"
                  }`}
                >
                  {isDragging ? <ImageIcon size={22} /> : <Upload size={22} />}
                </div>

                <p className="text-xs font-semibold text-gray-700">
                  {isDragging ? (
                    <span className="text-[#8B6F47]">Drop image here</span>
                  ) : (
                    <>
                      <span className="text-[#8B6F47] underline">
                        Click to upload
                      </span>{" "}
                      or drag & drop
                    </>
                  )}
                </p>

                <p className="text-[11px] text-gray-400 mt-1">
                  Supports dropping from Desktop, WhatsApp, or Web
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Or paste URL */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL directly..."
        className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#8B6F47] transition bg-white"
      />
    </div>
  );
}
