// components/navbar/auth-button-client.tsx
"use client";

import { logoutAction } from "@/lib/actions/auth";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type User = {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string | null;
} | null;

export default function AuthButtonClient({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-4">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" className="outline-none">
              <Avatar className="h-10 w-10 cursor-pointer">
                <AvatarImage
                  src={user.avatar || undefined}
                  alt={user.name || "User Avatar"}
                />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user.role}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {user.role === "ADMIN" && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem asChild>
              <form action={logoutAction} className="w-full">
                <button type="submit" className="w-full text-left text-red-500">
                  Logout
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Link
            href="/auth/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Sign In
          </Link>

          <Link
            href="/auth/register"
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
}
