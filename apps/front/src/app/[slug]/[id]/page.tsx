// app/[slug]/[id]/page.tsx
import CommentsSection from "@/components/comments/comments-section";
import LikeSection from "@/components/like/like-section";
import DeletePostButton from "@/components/post/delete-post-button";
import { fetchPost } from "@/lib/actions/postAction";
import { getCurrentUser } from "@/lib/session";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export default async function PostPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { commentPage } = await searchParams;
  const post = await fetchPost(+id);
  const user = await getCurrentUser();

  const isOwner = user?.id === post.user.id;
  const isAdmin = user?.role === "ADMIN";
  const canEdit = isOwner || isAdmin;

  return (
    <main className="min-h-screen bg-gray-50">
      <article className="mx-auto max-w-4xl px-4 py-8">
        {/* Post Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-blue-600"
          >
            ← Back to Posts
          </Link>

          {canEdit && (
            <div className="flex items-center gap-2">
              <Link
                href={`/portfolio/edit/${post.id}`}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600"
              >
                Edit
              </Link>
              <DeletePostButton postId={post.id} />
            </div>
          )}
        </div>

        {/* Thumbnail */}
        {post.thumbnail && (
          <Image
            src={post.thumbnail}
            alt={post.title}
            className="mb-8 h-[400px] w-full rounded-2xl object-cover shadow-lg"
            width={500}
            height={200}
          />
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>

        {/* Author */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {post.user.name.charAt(0).toUpperCase()}
          </div>
          <span>{post.user.name}</span>
          <span>•</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Content */}
        <div className="mt-8 text-gray-600 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {/* Like */}
        <div className="mt-8 border-y border-gray-200 py-4">
          <LikeSection postId={+id} />
        </div>

        {/* Comments */}
        <div id="comments">
          <CommentsSection postId={+id} page={commentPage ? +commentPage : 1} />
        </div>
      </article>
    </main>
  );
}
