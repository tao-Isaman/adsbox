"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createQuotation(
  _prevState: { error: string; success?: never } | { success: true; error?: never } | null,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "ไม่ได้เข้าสู่ระบบ" };
  }

  const orderId = formData.get("order_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const notes = formData.get("notes") as string;
  const validUntil = formData.get("valid_until") as string;

  if (!orderId || isNaN(amount) || amount <= 0) {
    return { error: "กรุณากรอกจำนวนเงินให้ถูกต้อง" };
  }

  const { error: quotationError } = await supabase
    .from("quotations")
    .insert({
      order_id: orderId,
      amount,
      notes: notes || null,
      valid_until: validUntil || null,
      created_by: user.id,
    });

  if (quotationError) {
    return { error: "ไม่สามารถสร้างใบเสนอราคาได้" };
  }

  const { error: orderError } = await supabase
    .from("orders")
    .update({ status: "quoted" })
    .eq("id", orderId)
    .eq("status", "pending");

  if (orderError) {
    return { error: "ไม่สามารถอัปเดตสถานะคำสั่งซื้อได้" };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/orders");
  return { success: true as const };
}

export async function confirmPayment(orderId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("id", orderId)
    .eq("status", "quoted");

  if (error) {
    return { error: "ไม่สามารถยืนยันการชำระเงินได้" };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/orders");
  return { success: true };
}
