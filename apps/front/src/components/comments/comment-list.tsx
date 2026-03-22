// components/comments/comment-list.tsx
"use client";

// import { deleteCommentAction } from "@/lib/actions/commentActions";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
};

type Props = {
  comments: Comment[];
  currentUserId?: number;
  postId: number;
};

export default function CommentList({
  comments,
  currentUserId,
  postId,
}: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  //   const handleDelete = async (commentId: number) => {
  //     setDeletingId(commentId);
  //     await deleteCommentAction(commentId, postId);
  //     setDeletingId(null);
  //   };

  if (comments.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-400">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const isOwner = currentUserId === comment.user.id;
        const formattedDate = new Date(comment.createdAt).toLocaleDateString(
          "en-US",
          { year: "numeric", month: "short", day: "numeric" },
        );

        return (
          <div
            key={comment.id}
            className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-sm"
          >
            {/* Header */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Avatar */}
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={comment.user.avatar || undefined}
                    alt={comment.user.name}
                  />
                  <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
                    {comment.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Name & Date */}
                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    {comment.user.name}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    {formattedDate}
                  </span>
                </div>
              </div>

              {/* Delete Button */}
              {/* {isOwner && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={deletingId === comment.id}
                  className="rounded-lg p-1.5 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
                >
                  {deletingId === comment.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              )} */}
            </div>

            {/* Content */}
            <p className="text-sm leading-relaxed text-gray-600">
              {comment.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}
