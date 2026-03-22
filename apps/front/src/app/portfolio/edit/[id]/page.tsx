// app/dashboard/posts/edit/[id]/page.tsx
import { fetchPost } from "@/lib/actions/postAction";
import { requireAuth } from "@/lib/session";
import { redirect } from "next/navigation";
import PostForm from "../../create-post/createPostForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const session = await requireAuth();
  const { id } = await params;
  const post = await fetchPost(+id);

  if (post.user.id !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Edit Post</h1>
        <PostForm post={post} />
      </div>
    </main>
  );
}
