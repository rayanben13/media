// app/register/register-form.tsx
"use client";

import SubmitButton from "@/components/submitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterAction } from "@/lib/actions/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useActionState, useState } from "react";

export default function RegisterForm() {
  const [state, formAction] = useActionState(RegisterAction, null);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const getFieldError = (field: string) => {
    return state?.error?.[field]?._errors?.[0];
  };

  if (state?.success) redirect("/auth/login");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-2 text-sm text-gray-500">
          Join us today and get started
        </p>
      </div>

      {/* Global Error */}
      {state?.error?.global && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error.global._errors[0]}
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name
          </Label>
          <Input
            name="name"
            id="name"
            placeholder="John Doe"
            value={values.name}
            onChange={handleChange}
            className={
              getFieldError("name")
                ? "border-red-400 focus-visible:ring-red-400"
                : ""
            }
          />
          {getFieldError("name") && (
            <p className="text-xs text-red-500">{getFieldError("name")}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            name="email"
            id="email"
            type="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
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
          <Input
            name="password"
            id="password"
            type="password"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange}
            className={
              getFieldError("password")
                ? "border-red-400 focus-visible:ring-red-400"
                : ""
            }
          />
          {getFieldError("password") && (
            <p className="text-xs text-red-500">{getFieldError("password")}</p>
          )}
        </div>

        {/* Submit */}
        <SubmitButton
          text="Create Account"
          loadingText="Creating account..."
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
        />
      </form>

      {/* Footer Link */}
      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
