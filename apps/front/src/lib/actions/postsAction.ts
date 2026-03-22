// lib/actions/postsAction.ts
"use server";

import { print } from "graphql";
import { revalidatePath } from "next/cache";
import { fetchGraphQL } from "../graphQL/graphql-fetch";
import {
  CREATE_POST_MUTATION,
  DELETE_POST,
  GET_POSTS_QUERY,
  UPDATE_POST,
} from "../graphQL/queries";
import { createPostSchema, updatePostSchema } from "../zod/create-post-schema";
import { createSafeAction } from "./safeAction";

// lib/actions/postsAction.ts
export const fetchPosts = async ({
  page = 1,
  pageSize = 5,
}: {
  page?: number;
  pageSize?: number;
}) => {
  const data = await fetchGraphQL(print(GET_POSTS_QUERY), {
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return {
    posts: data.posts.posts,
    total: data.posts.total,
    hasNextPage: data.posts.hasNextPage,
    hasPreviousPage: data.posts.hasPreviousPage,
    currentPage: page,
    totalPages: Math.ceil(data.posts.total / pageSize),
  };
};

export const createPost = createSafeAction(createPostSchema, async (input) => {
  const data = await fetchGraphQL(print(CREATE_POST_MUTATION), {
    input: {
      title: input.title,
      content: input.content,
      thumbnail: input.thumbnail || null,
      published: input.published,
    },
  });

  revalidatePath("/");
  revalidatePath("/portfolio/my-posts");

  return data.createPost;
});

// ✅ Update post
export const updatePost = createSafeAction(updatePostSchema, async (input) => {
  const data = await fetchGraphQL(print(UPDATE_POST), {
    input: {
      id: input.id,
      title: input.title,
      content: input.content,
      thumbnail: input.thumbnail || null,
      published: input.published,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard/my-posts");

  return data.updatePost;
});

// ✅ Delete post (no zod needed - just id)
export async function deletePostAction(id: number) {
  try {
    await fetchGraphQL(print(DELETE_POST), { id });
    revalidatePath("/");
    revalidatePath("/dashboard/my-posts");
    return { data: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete post";
    return { error: message };
  }
}
