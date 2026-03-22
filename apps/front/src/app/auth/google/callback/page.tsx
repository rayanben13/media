// app/auth/google/callback/page.tsx
"use client";

import { handleGoogleCallback } from "@/lib/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      // ✅ Server action reads cookies and creates session
      const result = await handleGoogleCallback();

      if (result.success) {
        router.push("/");
        router.refresh();
      } else {
        setError(result.error || "Authentication failed");
      }
    };

    processCallback();
  }, [router]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
            {error}
          </div>
          <Link
            href="/auth/login"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-sm text-gray-500">Completing Sign-In...</p>
      </div>
    </main>
  );
}
