// components/like/like-button.tsx
"use client";

import { toggleLikeAction } from "@/lib/actions/likeAction";
import { useState } from "react";

type Props = {
  postId: number;
  initialIsLiked: boolean;
  initialTotalLikes: number;
  isLoggedIn: boolean;
};

export default function LikeButton({
  postId,
  initialIsLiked,
  initialTotalLikes,
  isLoggedIn,
}: Props) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [totalLikes, setTotalLikes] = useState(initialTotalLikes);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!isLoggedIn) {
      window.location.href = "/auth/login";
      return;
    }

    // Optimistic update
    setIsLiked(!isLiked);
    setTotalLikes(isLiked ? totalLikes - 1 : totalLikes + 1);
    setLoading(true);

    const result = await toggleLikeAction(postId);

    if (result.success) {
      setIsLiked(result.isLiked);
      setTotalLikes(result.totalLikes);
    } else {
      // Revert on error
      setIsLiked(isLiked);
      setTotalLikes(totalLikes);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all active:scale-95 disabled:opacity-70 ${
        isLiked
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {/* Heart Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 transition-all ${
          isLiked
            ? "fill-red-500 text-red-500 scale-110"
            : "fill-none text-gray-400 group-hover:text-red-400"
        }`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>

      {/* Count */}
      <span>{totalLikes}</span>
    </button>
  );
}
