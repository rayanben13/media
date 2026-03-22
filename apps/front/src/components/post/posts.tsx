import { Post } from "@/lib/types/models-type";
import PostCard from "./postCard";

interface PostsProps {
  posts: Post[];
}

function Posts({ posts }: PostsProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Latest Posts</h1>
      </div>

      {/* Grid */}
      <div
        className="
        grid
        gap-6
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        xl:grid-cols-3
      "
      >
        {posts.map((post) => (
          <div key={post.id} className="flex justify-center">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Posts;
