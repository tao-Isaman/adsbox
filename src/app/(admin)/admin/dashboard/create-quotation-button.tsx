"use client";

import { useState, useActionState } from "react";
import { createQuotation } from "@/app/actions/admin-orders";

export function CreateQuotationButton({
  orderId,
  packagePrice,
}: {
  orderId: string;
  packagePrice: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [state, formAction, isPending] = useActionState(
    async (
      prev: { error: string } | { success: true } | null,
      formData: FormData
    ) => {
      const result = await createQuotation(prev, formData);
      if (result && "success" in result) {
        setIsOpen(false);
      }
      return result;
    },
    null
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-orange-600"
      >
        สร้างใบเสนอราคา
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold">สร้างใบเสนอราคา</h3>
            <p className="mt-1 text-sm text-zinc-500">
              กรอกรายละเอียดใบเสนอราคาสำหรับคำสั่งซื้อนี้
            </p>

            {state && "error" in state && (
              <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {state.error}
              </div>
            )}

            <form action={formAction} className="mt-4 space-y-4">
              <input type="hidden" name="order_id" value={orderId} />

              <div>
                <label
                  htmlFor={`amount-${orderId}`}
                  className="block text-sm font-medium text-zinc-700"
                >
                  จำนวนเงิน (บาท) *
                </label>
                <input
                  id={`amount-${orderId}`}
                  name="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  defaultValue={packagePrice}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor={`notes-${orderId}`}
                  className="block text-sm font-medium text-zinc-700"
                >
                  หมายเหตุ / เงื่อนไข
                </label>
                <textarea
                  id={`notes-${orderId}`}
                  name="notes"
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="เงื่อนไขเพิ่มเติม..."
                />
              </div>

              <div>
                <label
                  htmlFor={`valid_until-${orderId}`}
                  className="block text-sm font-medium text-zinc-700"
                >
                  ใช้ได้ถึงวันที่
                </label>
                <input
                  id={`valid_until-${orderId}`}
                  name="valid_until"
                  type="date"
                  defaultValue={defaultValidUntil}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
                >
                  {isPending ? "กำลังสร้าง..." : "สร้างใบเสนอราคา"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
