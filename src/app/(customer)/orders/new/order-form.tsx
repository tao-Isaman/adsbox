"use client";

import { useActionState } from "react";
import { createOrder } from "@/app/actions/orders";

export function OrderForm({
  packageId,
  defaultContactPerson,
  defaultCompanyName,
  defaultContactTel,
}: {
  packageId: string;
  defaultContactPerson: string;
  defaultCompanyName: string;
  defaultContactTel: string;
}) {
  const [state, formAction, isPending] = useActionState(createOrder, null);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="package_id" value={packageId} />

      {state?.error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="contact_person"
          className="block text-sm font-medium text-zinc-700"
        >
          ชื่อผู้ติดต่อ *
        </label>
        <input
          id="contact_person"
          name="contact_person"
          type="text"
          required
          defaultValue={defaultContactPerson}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="ชื่อ-นามสกุล"
        />
      </div>

      <div>
        <label
          htmlFor="company_name"
          className="block text-sm font-medium text-zinc-700"
        >
          ชื่อบริษัท / แบรนด์
        </label>
        <input
          id="company_name"
          name="company_name"
          type="text"
          defaultValue={defaultCompanyName}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="ชื่อบริษัทหรือแบรนด์"
        />
      </div>

      <div>
        <label
          htmlFor="contact_tel"
          className="block text-sm font-medium text-zinc-700"
        >
          เบอร์โทรศัพท์ *
        </label>
        <input
          id="contact_tel"
          name="contact_tel"
          type="tel"
          required
          defaultValue={defaultContactTel}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="08X-XXX-XXXX"
        />
      </div>

      <div>
        <label
          htmlFor="ad_details"
          className="block text-sm font-medium text-zinc-700"
        >
          รายละเอียดโฆษณา
        </label>
        <textarea
          id="ad_details"
          name="ad_details"
          rows={4}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="อธิบายรายละเอียดโฆษณาที่ต้องการ เช่น ลักษณะโลโก้ ข้อความ หรือข้อกำหนดพิเศษ"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
      >
        {isPending ? "กำลังส่งคำสั่งซื้อ..." : "ส่งคำสั่งซื้อ"}
      </button>
    </form>
  );
}
