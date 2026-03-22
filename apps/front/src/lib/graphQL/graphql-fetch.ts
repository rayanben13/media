// lib/graphQL/graphql-fetch.ts
import { getAccessToken } from "../session"; // ✅ أو من المكان اللي حافظ فيه الـ session

export const fetchGraphQL = async (
  query: string,
  variables?: Record<string, any>,
) => {
  const url = process.env.BACKEND_URL + "/graphql";

  // ✅ Get token from session
  let token: string | null = null;
  try {
    token = await getAccessToken();
  } catch {
    // Not in server context
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // ✅ Attach token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const responseBody = await response.json();

  if (responseBody.errors) {
    const errorMessage =
      responseBody.errors[0]?.extensions?.originalError?.message ||
      responseBody.errors[0]?.message ||
      "Something went wrong";

    throw new Error(errorMessage);
  }

  return responseBody.data;
};
