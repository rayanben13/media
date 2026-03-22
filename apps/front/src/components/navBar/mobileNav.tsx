// components/navbar/mobileNav.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { navItems } from "./nav-data";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
} | null;

type Props = {
  user: User;
};

export default function MobileNav({ user }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-80 p-0">
        {/* Header */}
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-left text-xl font-bold">
            <span className="text-primary">My</span>Brand
          </SheetTitle>
        </SheetHeader>

        <Separator />

        {/* User Info (if logged in) */}
        {user && (
          <>
            <div className="p-4">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <Avatar>
                    <AvatarImage
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </Avatar>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 p-4 overflow-y-auto max-h-[calc(100vh-300px)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Dashboard link for admin */}
          {user?.role === "ADMIN" && (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className={cn(
                "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === "/dashboard"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground",
              )}
            >
              Dashboard
            </Link>
          )}

          {/* My Posts link for logged in users */}
          {user && (
            <Link
              href="/dashboard/my-posts"
              onClick={() => setOpen(false)}
              className={cn(
                "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === "/dashboard/my-posts"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground",
              )}
            >
              My Posts
            </Link>
          )}
        </nav>

        <Separator />

        {/* Footer: Auth Buttons OR Logout */}
        <div className="p-4 space-y-3">
          {user ? (
            /* ✅ Logged in: Show logout */
            <form
              action={async () => {
                setOpen(false);
                await logoutAction();
              }}
            >
              <Button
                type="submit"
                variant="outline"
                className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                size="lg"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </form>
          ) : (
            /* ✅ Not logged in: Show sign in / create account */
            <>
              <Link href="/auth/login" onClick={() => setOpen(false)}>
                <Button className="w-full" size="lg">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full" size="lg">
                  Create Account
                </Button>
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
