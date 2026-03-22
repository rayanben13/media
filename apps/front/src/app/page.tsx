// app/page.tsx
import Pagination from "@/components/pagination";
import PostCard from "@/components/post/postCard";
import { fetchLikeStatusBatch } from "@/lib/actions/likeAction";
import { fetchPosts } from "@/lib/actions/postsAction";
import { getCurrentUser } from "@/lib/session";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export default async function Home({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = page ? +page : 1;

  const user = await getCurrentUser();
  const { posts, totalPages, hasNextPage, hasPreviousPage } = await fetchPosts({
    page: currentPage,
  });

  // ✅ One batch query for ALL posts' like statuses
  const postIds = posts.map((p: any) => p.id);
  const likeStatuses = await fetchLikeStatusBatch(postIds, user?.id);

  return (
    <main>
      <section id="posts" className="mx-auto max-w-4xl px-4 py-10">
        <div className="grid gap-6">
          {posts.map((post: any) => {
            // ✅ Find like status for this post
            const likeStatus = likeStatuses.find(
              (l: any) => l.postId === post.id,
            ) || { isLiked: false, totalLikes: 0 };

            return (
              <PostCard
                key={post.id}
                post={post}
                isLiked={likeStatus.isLiked}
                totalLikes={likeStatus.totalLikes}
                isLoggedIn={!!user}
              />
            );
          })}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      </section>
    </main>
  );
}
