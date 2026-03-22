// components/post/delete-post-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { deletePostAction } from "@/lib/actions/postsAction";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  postId: number;
};

export default function DeletePostButton({ postId }: Props) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deletePostAction(postId);

    if (result.success) {
      router.push("/dashboard/my-posts");
      router.refresh();
    } else {
      alert(result.error);
    }

    setLoading(false);
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">Delete this post?</span>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Yes, Delete"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowConfirm(false)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-red-500 hover:bg-red-50 hover:text-red-600"
      onClick={() => setShowConfirm(true)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
