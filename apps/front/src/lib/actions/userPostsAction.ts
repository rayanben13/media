// lib/actions/userPostsAction.ts
"use server";

import { print } from "graphql";
import { fetchGraphQL } from "../graphQL/graphql-fetch";
import { GET_MY_POSTS, GET_USER_POSTS } from "../graphQL/queries";

// ✅ Fetch user's posts (public)
export async function fetchUserPosts({
  userId,
  page = 1,
  pageSize = 6,
}: {
  userId: number;
  page?: number;
  pageSize?: number;
}) {
  const data = await fetchGraphQL(print(GET_USER_POSTS), {
    userId,
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return {
    posts: data.userPosts.posts,
    total: data.userPosts.total,
    hasNextPage: data.userPosts.hasNextPage,
    hasPreviousPage: data.userPosts.hasPreviousPage,
    currentPage: page,
    totalPages: Math.ceil(data.userPosts.total / pageSize),
  };
}

// ✅ Fetch my posts (protected)
export async function fetchMyPosts({
  page = 1,
  pageSize = 6,
}: {
  page?: number;
  pageSize?: number;
}) {
  const data = await fetchGraphQL(print(GET_MY_POSTS), {
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  return {
    posts: data.myPosts.posts,
    total: data.myPosts.total,
    hasNextPage: data.myPosts.hasNextPage,
    hasPreviousPage: data.myPosts.hasPreviousPage,
    currentPage: page,
    totalPages: Math.ceil(data.myPosts.total / pageSize),
  };
}
