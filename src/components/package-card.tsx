import Link from "next/link";
import type { Package } from "@/lib/supabase/types";

export function PackageCard({ pkg }: { pkg: Package }) {
  const formattedPrice = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(pkg.price);

  if (pkg.is_contact_us) {
    return (
      <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold">{pkg.name}</h3>
          <p className="mt-1 text-sm text-zinc-500">
            แพ็กเกจสำหรับออเดอร์ขนาดใหญ่
          </p>
        </div>
        <div className="mt-6">
          <p className="text-2xl font-bold">ราคาพิเศษ</p>
          <a
            href="mailto:contact@adsbox.com"
            className="mt-4 block w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-center text-sm font-medium transition hover:bg-zinc-50"
          >
            ติดต่อเรา
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold">{pkg.name}</h3>
        <p className="mt-1 text-sm text-zinc-500">
          {pkg.box_amount.toLocaleString()} กล่อง
        </p>
      </div>
      <div className="mt-6">
        <p className="text-2xl font-bold">{formattedPrice}</p>
        <Link
          href={`/orders/new?package=${pkg.id}`}
          className="mt-4 block w-full rounded-lg bg-orange-500 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-orange-600"
        >
          สั่งซื้อ
        </Link>
      </div>
    </div>
  );
}
