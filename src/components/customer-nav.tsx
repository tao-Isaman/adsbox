"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";

const navLinks = [
  { href: "/packages", label: "แพ็กเกจ" },
  { href: "/orders", label: "คำสั่งซื้อ" },
];

export function CustomerNav({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <Link href="/packages" className="text-lg font-bold text-orange-500">
            AdsBox
          </Link>
          <div className="flex gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  pathname === link.href
                    ? "bg-orange-50 text-orange-600"
                    : "text-zinc-600 hover:text-orange-500"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-600">
            {userName}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition hover:text-orange-500"
            >
              ออกจากระบบ
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
