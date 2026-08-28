import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showCount?: boolean;
  count?: number;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 14,
  showCount = false,
  count = 0,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: maxStars }, (_, i) => {
          const filled = i < Math.floor(rating);
          const halfFilled = !filled && i < rating;

          return (
            <Star
              key={i}
              size={size}
              className={
                filled
                  ? "fill-amber-400 text-amber-400"
                  : halfFilled
                    ? "fill-amber-400/50 text-amber-400"
                    : "text-gray-300"
              }
            />
          );
        })}
      </div>
      {showCount && count > 0 && (
        <span className="text-xs text-gray-500">({count})</span>
      )}
    </div>
  );
}
