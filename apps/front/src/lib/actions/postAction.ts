import { print } from "graphql";
import { fetchGraphQL } from "../graphQL/graphql-fetch";
import { GET_POST_QUERY } from "../graphQL/queries";

export const fetchPost = async (id: number) => {
  const data = await fetchGraphQL(print(GET_POST_QUERY), { id });
  return data.post;
};
