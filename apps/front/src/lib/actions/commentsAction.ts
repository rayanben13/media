// lib/actions/commentActions.ts
"use server";

import { print } from "graphql";
import { revalidatePath } from "next/cache";
import { fetchGraphQL } from "../graphQL/graphql-fetch";
import { CREATE_COMMENT, POST_COMMENTS_QUERY } from "../graphQL/queries";

// ✅ Fetch comments
export async function fetchComments({
  postId,
  page = 1,
  pageSize = 2,
}: {
  postId: number;
  page?: number;
  pageSize?: number;
}) {
  const data = await fetchGraphQL(print(POST_COMMENTS_QUERY), {
    postId,
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return {
    comments: data.comments.comments,
    total: data.comments.total,
    hasNextPage: data.comments.hasNextPage,
    currentPage: page,
    totalPages: Math.ceil(data.comments.total / pageSize),
  };
}

// ✅ Create comment

export async function createCommentAction(prevState: any, formData: FormData) {
  const content = formData.get("content") as string;
  const postId = Number(formData.get("postId"));

  if (!content || content.trim().length < 1) {
    return { success: false, error: "Comment cannot be empty" };
  }

  try {
    await fetchGraphQL(print(CREATE_COMMENT), {
      input: { content: content.trim(), postId },
    });

    revalidatePath("/");
    return { success: true, error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to post comment";
    return { success: false, error: message };
  }
}

// ✅ Delete comment
// export async function deleteCommentAction(commentId: number, postId: number) {
//   try {
//     await fetchGraphQL(print(DELETE_COMMENT), { commentId });
//     revalidatePath(`/posts/${postId}`);
//     return { success: true };
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Failed to delete comment";
//     return { success: false, error: message };
//   }
// }
