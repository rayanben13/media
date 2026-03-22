"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Session = {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  };
  accessToken: string;
  expiresAt: Date;
};

type SessionPayload = {
  user: Session["user"];
  accessToken: string;
  expiresAt: string;
};

const SECRET_KEY = process.env.SESSION_SECRET || "your-session-secret-key";
const encodedKey = new TextEncoder().encode(SECRET_KEY);

const SESSION_COOKIE = "session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

// ✅ Encrypt session data
async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

// ✅ Decrypt session data
async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

// ✅ Create session
export async function createSession(
  user: Session["user"],
  accessToken: string,
) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  const session = await encrypt({
    user,
    accessToken,
    expiresAt: expiresAt.toISOString(),
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

// ✅ Get session
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  const payload = await decrypt(token);
  if (!payload) return null;

  const expiresAt = new Date(payload.expiresAt);

  // Expired
  if (expiresAt < new Date()) {
    await deleteSession();
    return null;
  }

  return {
    user: payload.user,
    accessToken: payload.accessToken,
    expiresAt,
  };
}

// ✅ User shortcut
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

// ✅ Token shortcut
export async function getAccessToken() {
  const session = await getSession();

  return session?.accessToken || null;
}

// ✅ Update session
export async function updateSession() {
  const session = await getSession();
  if (!session) return null;

  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  const newSession = await encrypt({
    user: session.user,
    accessToken: session.accessToken,
    expiresAt: expiresAt.toISOString(),
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

// ✅ Logout
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// ✅ Require auth
export async function requireAuth() {
  const session = await getSession();

  if (!session) redirect("/auth/login");

  return session;
}

// ✅ Require role
export async function requireRole(role: string) {
  const session = await requireAuth();

  if (session.user.role !== role) redirect("/");

  return session;
}
