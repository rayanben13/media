// components/comments/comment-pagination.tsx
import Link from "next/link";

type Props = {
  postId: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
};

export default function CommentPagination({
  postId,
  currentPage,
  totalPages,
  hasNextPage,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      {currentPage > 1 && (
        <Link
          href={`/posts/${postId}?commentPage=${currentPage - 1}#comments`}
          scroll={false}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600"
        >
          ← Previous
        </Link>
      )}

      <span className="text-sm text-gray-500">
        {currentPage} / {totalPages}
      </span>

      {hasNextPage && (
        <Link
          href={`/posts/${postId}?commentPage=${currentPage + 1}#comments`}
          scroll={false}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600"
        >
          Next →
        </Link>
      )}
    </div>
  );
}
