"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  badgeColor?: string;
}

interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  align?: "left" | "right";
  size?: "sm" | "md";
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  align = "left",
  size = "md",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full inline-flex items-center justify-between gap-2.5 bg-[#FAF7F4] hover:bg-[#F3EDE6] border border-[#E3DAD1] hover:border-[#7C4D30] text-[#2A1C15] font-semibold rounded-xl transition-all cursor-pointer shadow-2xs ${
          size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-xs sm:text-sm"
        } ${isOpen ? "border-[#7C4D30] ring-2 ring-[#7C4D30]/15" : ""}`}
      >
        <span className="truncate flex items-center gap-2">
          {selectedOption ? (
            <>
              {selectedOption.badgeColor && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${selectedOption.badgeColor}`}
                >
                  {selectedOption.label}
                </span>
              )}
              {!selectedOption.badgeColor && selectedOption.label}
            </>
          ) : (
            <span className="text-[#A08B7D] font-normal">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          size={15}
          className={`text-[#8C7567] flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#7C4D30]" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-1.5 w-48 sm:w-56 bg-white border border-[#E3DAD1] rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-60 overflow-y-auto no-scrollbar`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#7C4D30] text-white shadow-2xs"
                    : "text-[#4A3528] hover:bg-[#FAF7F4] hover:text-[#2A1C15]"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {option.badgeColor && !isSelected ? (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${option.badgeColor}`}
                    >
                      {option.label}
                    </span>
                  ) : (
                    option.label
                  )}
                </span>
                {isSelected && <Check size={14} className="text-white flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
