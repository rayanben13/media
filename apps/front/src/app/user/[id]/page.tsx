// app/user/[id]/page.tsx
import Pagination from "@/components/pagination";
import PostCard from "@/components/post/post-card";
import { fetchLikeStatusBatch } from "@/lib/actions/likeAction";
import { fetchUserPosts } from "@/lib/actions/userPostsAction";
import { getCurrentUser } from "@/lib/session";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export default async function UserProfilePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { page } = await searchParams;
  const currentPage = page ? +page : 1;

  const currentUser = await getCurrentUser();
  const { posts, total, totalPages, hasNextPage, hasPreviousPage } =
    await fetchUserPosts({ userId: +id, page: currentPage });

  // ✅ Batch like status
  const postIds = posts.map((p: any) => p.id);
  const likeStatuses = await fetchLikeStatusBatch(postIds, currentUser?.id);

  // Get user info from first post
  const profileUser = posts[0]?.user;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {profileUser?.avatar ? (
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                {profileUser?.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}

            {/* Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profileUser?.name || "User"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {total} {total === 1 ? "post" : "posts"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <section className="mx-auto max-w-4xl px-4 py-8">
        {posts.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            No posts yet.
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
                  isLoggedIn={!!currentUser}
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
          basePath={`/user/${id}`}
        />
      </section>
    </main>
  );
}
