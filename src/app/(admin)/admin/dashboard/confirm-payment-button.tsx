"use client";

import { useTransition } from "react";
import { confirmPayment } from "@/app/actions/admin-orders";

export function ConfirmPaymentButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(() => {
      confirmPayment(orderId);
    });
  };

  return (
    <button
      onClick={handleConfirm}
      disabled={isPending}
      className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
    >
      {isPending ? "กำลังยืนยัน..." : "ยืนยันการชำระเงิน"}
    </button>
  );
}
