// components/comments/comments-section.tsx
import { getCurrentUser } from "@/lib/session";

import { fetchComments } from "@/lib/actions/commentsAction";
import Link from "next/link";
import CommentForm from "./comment-form";
import CommentList from "./comment-list";
import CommentPagination from "./comment-pagination";

type Props = {
  postId: number;
  page?: number;
};

export default async function CommentsSection({ postId, page = 1 }: Props) {
  const [commentsData, user] = await Promise.all([
    fetchComments({ postId, page }),
    getCurrentUser(),
  ]);

  return (
    <section className="mt-12">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
          {commentsData.total}
        </span>
      </div>

      {/* Comment Form */}
      {user ? (
        <CommentForm postId={postId} userName={user.name} />
      ) : (
        <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500">
          Please{" "}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:underline"
          >
            sign in
          </Link>{" "}
          to leave a comment.
        </div>
      )}

      {/* Comments List */}
      <CommentList
        comments={commentsData.comments}
        currentUserId={user?.id}
        postId={postId}
      />

      {/* Pagination */}
      <CommentPagination
        postId={postId}
        currentPage={commentsData.currentPage}
        totalPages={commentsData.totalPages}
        hasNextPage={commentsData.hasNextPage}
      />
    </section>
  );
}
