"use client";

import { useTransition } from "react";
import { confirmOrder } from "@/app/actions/admin-orders";

export function ConfirmOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(() => {
      confirmOrder(orderId);
    });
  };

  return (
    <button
      onClick={handleConfirm}
      disabled={isPending}
      className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
    >
      {isPending ? "Confirming..." : "Confirm"}
    </button>
  );
}
