// lib/actions/likeActions.ts
"use server";

import { print } from "graphql";
import { revalidatePath } from "next/cache";
import { fetchGraphQL } from "../graphQL/graphql-fetch";
import {
  GET_LIKE_STATUS,
  GET_LIKE_STATUS_BATCH,
  TOGGLE_LIKE,
} from "../graphQL/queries";

// ✅ Toggle like
export async function toggleLikeAction(postId: number) {
  try {
    const data = await fetchGraphQL(print(TOGGLE_LIKE), { postId });
    revalidatePath("/");
    return {
      success: true,
      isLiked: data.toggleLike.isLiked,
      totalLikes: data.toggleLike.totalLikes,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to like post";
    return { success: false, error: message };
  }
}

// ✅ Single post like status
export async function fetchLikeStatus(postId: number, userId?: number) {
  try {
    const data = await fetchGraphQL(print(GET_LIKE_STATUS), {
      postId,
      userId,
    });
    return data.likeStatus;
  } catch {
    return { isLiked: false, totalLikes: 0 };
  }
}

// ✅ NEW: Batch like status for post list
export async function fetchLikeStatusBatch(postIds: number[], userId?: number) {
  try {
    const data = await fetchGraphQL(print(GET_LIKE_STATUS_BATCH), {
      postIds,
      userId,
    });
    return data.likeStatusBatch;
  } catch {
    return postIds.map((postId) => ({
      postId,
      isLiked: false,
      totalLikes: 0,
    }));
  }
}
