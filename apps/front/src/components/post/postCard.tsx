import LikeButton from "@/components/like/like-button";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import DeletePostButton from "./delete-post-button";

type Props = {
  post: {
    id: number;
    title: string;
    content: string;
    slug: string;
    thumbnail: string;
    createdAt: string;
  };
  isLiked: boolean;
  totalLikes: number;
  isLoggedIn: boolean;
  showActions?: boolean; // ✅ new
};

export default function PostCard({
  post,
  isLiked,
  totalLikes,
  isLoggedIn,
  showActions = false,
}: Props) {
  return (
    <Card className="group overflow-hidden border-none bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-muted-foreground text-sm">
            No Image
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

        {/* Floating badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/80 backdrop-blur text-gray-800">
            Post
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Title */}
        <Link href={`/${post.slug}/${post.id}`}>
          <h2 className="text-lg font-semibold leading-snug text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.content}
          </p>
        </Link>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3">
          <LikeButton
            postId={post.id}
            initialIsLiked={isLiked}
            initialTotalLikes={totalLikes}
            isLoggedIn={isLoggedIn}
          />

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>

            {showActions && (
              <div className="flex items-center gap-1">
                <Link href={`/dashboard/posts/edit/${post.id}`}>
                  <Button size="icon" variant="ghost">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Link>

                <DeletePostButton postId={post.id}>
                  <Button size="icon" variant="ghost">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </DeletePostButton>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
