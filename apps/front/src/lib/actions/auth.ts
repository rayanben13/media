"use server";

import { createUserSchema, loginUserSchema } from "./../zod/auth-schema";
// lib/actions/auth.ts

import { print } from "graphql";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { fetchGraphQL } from "../graphQL/graphql-fetch";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../graphQL/queries";
import { createSession, deleteSession } from "../session";

// ✅ Login
export async function loginAction(prevState: unknown, formData: FormData) {
  // const parsed = LoginUserSchema.

  const res = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginUserSchema.safeParse(res);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.format(), // ✅ same structure for each field
    };
  }

  try {
    const data = await fetchGraphQL(print(LOGIN_MUTATION), {
      loginInput: parsed.data,
    });

    await createSession(data.login.user, data.login.accessToken);

    return { success: true, user: data.login.user };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return {
      success: false,
      error: {
        global: { _errors: [message] },
      },
    };
  }
}

// lib/actions/auth.ts

export async function RegisterAction(prevState: unknown, formData: FormData) {
  // 🔹 get data from form
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // 🔹 validate using Zod
  const parsed = createUserSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.format(), // ✅ same structure for each field
    };
  }

  try {
    const result = await fetchGraphQL(print(SIGNUP_MUTATION), {
      input: parsed.data,
    });

    // save token
    const cookieStore = await cookies();
    cookieStore.set("token", result.signUp.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return {
      success: true,
      user: result.signUp.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        global: { _errors: [error.message] },
      },
    };
  }
}

// ✅ Get current user
// export async function getMe() {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!token) return null;

//     const data = await fetchGraphQLWithAuth(print(ME_QUERY), {}, token);
//     return data.me;
//   } catch {
//     return null;
//   }
// }

// ✅ Logout
export async function logoutAction() {
  await deleteSession();
  redirect("/auth/login");
}

// lib/actions/auth.ts (add this function)

// lib/actions/auth.ts

export async function handleGoogleCallback() {
  try {
    const cookieStore = await cookies();

    // ✅ Read token and user from cookies (set by NestJS)
    const token = cookieStore.get("google-auth-token")?.value;
    const userStr = cookieStore.get("google-auth-user")?.value;

    if (!token || !userStr) {
      return { success: false, error: "No authentication data found" };
    }

    // ✅ Parse user data
    const user = JSON.parse(userStr);

    // ✅ Create session (encrypted cookie)
    await createSession(user, token);

    // ✅ Delete temporary cookies (clean up)
    cookieStore.delete("google-auth-token");
    cookieStore.delete("google-auth-user");

    return { success: true };
  } catch {
    return { success: false, error: "Failed to complete authentication" };
  }
}

// ✅ Fetch with Auth Token
// async function fetchGraphQLWithAuth(
//   query: string,
//   variables: Record<string, any>,
//   token: string,
// ) {
//   const url = process.env.BACKEND_URL + "/graphql";

//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`, // ← Send token
//     },
//     body: JSON.stringify({ query, variables }),
//   });

//   const responseBody = await response.json();

//   if (responseBody.errors) {
//     throw new Error(responseBody.errors[0]?.message || "GraphQL error");
//   }

//   return responseBody.data;
// }
