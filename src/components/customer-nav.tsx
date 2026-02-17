"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";

const navLinks = [
  { href: "/packages", label: "Packages" },
  { href: "/orders", label: "My Orders" },
];

export function CustomerNav({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <Link href="/packages" className="text-lg font-bold">
            AdsBox
          </Link>
          <div className="flex gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  pathname === link.href
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {userName}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
