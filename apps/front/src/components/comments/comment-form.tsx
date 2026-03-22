// components/comments/comment-form.tsx
"use client";

import { createCommentAction } from "@/lib/actions/commentsAction";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  postId: number;
  userName: string;
};

export default function CommentForm({ postId, userName }: Props) {
  const [state, formAction] = useActionState(createCommentAction, null);
  const [content, setContent] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      formRef.current?.reset();
      setContent("");

      toast.success("Comment posted successfully!");
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  console.log("User Name:", userName);
  console.log("Post ID:", postId);

  return (
    <div className="mb-8">
      {/* User Info */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700">{userName}</span>
      </div>

      {/* Form */}
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="postId" value={postId} />

        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
        />

        {/* Error */}
        {state?.error && (
          <p className="mt-1 text-xs text-red-500">{state.error}</p>
        )}

        {/* Submit */}
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={!content.trim()}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );
}
