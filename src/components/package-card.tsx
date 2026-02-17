"use client";

import { createOrder } from "@/app/actions/orders";
import type { Package } from "@/lib/supabase/types";
import { useTransition } from "react";

export function PackageCard({ pkg }: { pkg: Package }) {
  const [isPending, startTransition] = useTransition();

  const handleBuy = () => {
    startTransition(() => {
      createOrder(pkg.id);
    });
  };

  const formattedPrice = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(pkg.price);

  if (pkg.is_contact_us) {
    return (
      <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <h3 className="text-lg font-semibold">{pkg.name}</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            แพ็กเกจสำหรับออเดอร์ขนาดใหญ่
          </p>
        </div>
        <div className="mt-6">
          <p className="text-2xl font-bold">ราคาพิเศษ</p>
          <a
            href="mailto:contact@adsbox.com"
            className="mt-4 block w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-center text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            ติดต่อเรา
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <h3 className="text-lg font-semibold">{pkg.name}</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {pkg.box_amount.toLocaleString()} กล่อง
        </p>
      </div>
      <div className="mt-6">
        <p className="text-2xl font-bold">{formattedPrice}</p>
        <button
          onClick={handleBuy}
          disabled={isPending}
          className="mt-4 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isPending ? "กำลังดำเนินการ..." : "สั่งซื้อ"}
        </button>
      </div>
    </div>
  );
}
