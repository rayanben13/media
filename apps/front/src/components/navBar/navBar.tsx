// components/navBar/navBar.tsx
"use client";

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import DesktopNav from "./disktopNav";

// ✅ Load MobileNav only on client (no SSR)
const MobileNav = dynamic(() => import("./mobileNav"), {
  ssr: false,
});

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
} | null;

type Props = {
  authButton: ReactNode;
  user: User;
};

export default function Navbar({ authButton, user }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "border-b bg-background/80 backdrop-blur-md",
        scrolled ? "shadow-md border-border" : "border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-lg">
                M
              </span>
            </div>
            <span>
              <span className="text-primary">My</span>Brand
            </span>
          </Link>

          <DesktopNav />

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2">
              {authButton}
            </div>
            <MobileNav user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
