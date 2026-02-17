"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createOrder(packageId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase.from("orders").insert({
    customer_id: user.id,
    package_id: packageId,
    status: "pending",
  });

  if (error) {
    return { error: "ไม่สามารถสร้างคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง" };
  }

  redirect("/orders");
}
