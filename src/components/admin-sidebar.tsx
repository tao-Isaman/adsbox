"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "แดชบอร์ด" },
  { href: "/admin/users", label: "จัดการผู้ใช้" },
  { href: "/admin/matching", label: "จับคู่กลุ่ม" },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
        <Link href="/admin/dashboard" className="text-lg font-bold">
          AdsBox แอดมิน
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
              pathname === link.href
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <p className="mb-2 truncate text-sm text-zinc-600 dark:text-zinc-400">
          {userName}
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            ออกจากระบบ
          </button>
        </form>
      </div>
    </aside>
  );
}
