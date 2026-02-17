"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function confirmOrder(orderId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ status: "confirmed" })
    .eq("id", orderId)
    .eq("status", "pending");

  if (error) {
    return { error: "ไม่สามารถยืนยันคำสั่งซื้อได้" };
  }

  revalidatePath("/admin/dashboard");
  return { success: true };
}
