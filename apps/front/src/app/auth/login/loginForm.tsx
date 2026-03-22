// components/auth/login-form.tsx
"use client";

import SubmitButton from "@/components/submitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/actions/auth";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [state, action] = useActionState(loginAction, null);
  const router = useRouter();

  // ✅ Redirect on success
  useEffect(() => {
    if (state?.success) {
      router.push("/");
      router.refresh();
    }
  }, [state?.success, router]);

  const getFieldError = (field: string) => {
    return state?.error?.[field]?._errors?.[0];
  };

  return (
    <>
      {/* Global Error */}
      {state?.error?.global && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {state.error.global._errors[0]}
        </div>
      )}

      <form action={action} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            placeholder="you@example.com"
            className={
              getFieldError("email")
                ? "border-red-400 focus-visible:ring-red-400"
                : ""
            }
          />
          {getFieldError("email") && (
            <p className="text-xs text-red-500">{getFieldError("email")}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className={`pr-10 ${
                getFieldError("password")
                  ? "border-red-400 focus-visible:ring-red-400"
                  : ""
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {getFieldError("password") && (
            <p className="text-xs text-red-500">{getFieldError("password")}</p>
          )}
        </div>

        {/* Submit */}
        <SubmitButton
          text="Sign In"
          loadingText="Signing in..."
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
        />
      </form>
    </>
  );
}
