"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone. Do you really want to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-[#E3DAD1] space-y-5 text-center relative animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#8C7567] hover:bg-[#FAF7F4] rounded-xl transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Icon Header */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-2xs ${
            variant === "danger"
              ? "bg-rose-50 text-rose-600 border border-rose-200"
              : "bg-amber-50 text-amber-600 border border-amber-200"
          }`}
        >
          {variant === "danger" ? <Trash2 size={26} /> : <AlertTriangle size={26} />}
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-[#2A1C15]">{title}</h3>
          <p className="text-xs text-[#7A6658] leading-relaxed">{message}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 bg-[#FAF7F4] hover:bg-[#F3EDE6] border border-[#E3DAD1] text-[#4A3528] font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            disabled={loading}
            className={`flex-1 py-2.5 text-white font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer ${
              variant === "danger"
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
