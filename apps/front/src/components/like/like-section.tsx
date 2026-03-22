// components/like/like-section.tsx
import { fetchLikeStatus } from "@/lib/actions/likeAction";
import { getCurrentUser } from "@/lib/session";
import LikeButton from "./like-button";

type Props = {
  postId: number;
};

export default async function LikeSection({ postId }: Props) {
  const user = await getCurrentUser();
  const { isLiked, totalLikes } = await fetchLikeStatus(postId, user?.id);

  return (
    <LikeButton
      postId={postId}
      initialIsLiked={isLiked}
      initialTotalLikes={totalLikes}
      isLoggedIn={!!user}
    />
  );
}
