// components/pagination.tsx
import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  basePath?: string; // ✅ NEW
};

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  basePath = "/", // ✅ default = homepage
}: Props) {
  if (totalPages <= 1) return null;

  // ✅ Build URL based on basePath
  const buildUrl = (page: number) => {
    return `${basePath}?page=${page}`;
  };

  return (
    <nav className="flex flex-wrap items-center justify-center gap-3 py-10">
      {hasPreviousPage && (
        <Link
          href={buildUrl(currentPage - 1)}
          scroll={false}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-500 hover:text-blue-600 hover:shadow-md active:scale-95"
        >
          ← Previous
        </Link>
      )}

      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          const isActive = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={buildUrl(pageNum)}
              scroll={false}
              className={
                isActive
                  ? "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-md pointer-events-none"
                  : "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:shadow-md active:scale-95"
              }
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {hasNextPage && (
        <Link
          href={buildUrl(currentPage + 1)}
          scroll={false}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-500 hover:text-blue-600 hover:shadow-md active:scale-95"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}
