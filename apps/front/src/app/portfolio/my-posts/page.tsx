// app/dashboard/my-posts/page.tsx
import Pagination from "@/components/pagination";
import PostCard from "@/components/post/postCard";
import { fetchLikeStatusBatch } from "@/lib/actions/likeAction";
import { fetchMyPosts } from "@/lib/actions/userPostsAction";
import { requireAuth } from "@/lib/session";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export default async function MyPostsPage({ searchParams }: Props) {
  const session = await requireAuth();
  const { page } = await searchParams;
  const currentPage = page ? +page : 1;

  const { posts, total, totalPages, hasNextPage, hasPreviousPage } =
    await fetchMyPosts({ page: currentPage });

  // ✅ Batch like status
  const postIds = posts.map((p: any) => p.id);
  const likeStatuses = await fetchLikeStatusBatch(postIds, session.user.id);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Posts</h1>
            <p className="mt-1 text-sm text-gray-500">
              {total} {total === 1 ? "post" : "posts"}
            </p>
          </div>

          <Link
            href="/portfolio/create-post"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95"
          >
            + New Post
          </Link>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
            <p className="text-gray-400">
              You haven&apos;t written any posts yet.
            </p>
            <Link
              href="/dashboard/posts/create"
              className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Write Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post: any) => {
              const likeStatus = likeStatuses.find(
                (l: any) => l.postId === post.id,
              ) || { isLiked: false, totalLikes: 0 };

              return (
                <PostCard
                  key={post.id}
                  post={post}
                  isLiked={likeStatus.isLiked}
                  totalLikes={likeStatus.totalLikes}
                  isLoggedIn={true}
                  showActions={true}
                />
              );
            })}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          basePath="/portfolio/my-posts"
        />
      </div>
    </main>
  );
}
