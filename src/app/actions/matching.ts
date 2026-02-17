"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createMatchGroup(name: string, orderIds: string[]) {
  if (orderIds.length !== 4) {
    return { error: "ต้องเลือกออเดอร์ 4 รายการเพื่อสร้างกลุ่ม" };
  }

  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, package_id, status")
    .in("id", orderIds);

  if (!orders || orders.length !== 4) {
    return { error: "ไม่พบออเดอร์บางรายการ" };
  }

  const packageId = orders[0].package_id;
  const allSamePackage = orders.every((o) => o.package_id === packageId);
  const allPaid = orders.every((o) => o.status === "paid");

  if (!allSamePackage) {
    return { error: "ออเดอร์ทั้งหมดต้องเป็นแพ็กเกจเดียวกัน" };
  }
  if (!allPaid) {
    return { error: "ออเดอร์ทั้งหมดต้องมีสถานะชำระเงินแล้ว" };
  }

  const { data: group, error: groupError } = await supabase
    .from("match_groups")
    .insert({ name, package_id: packageId })
    .select()
    .single();

  if (groupError || !group) {
    return { error: "ไม่สามารถสร้างกลุ่มจับคู่ได้" };
  }

  const members = orderIds.map((orderId) => ({
    match_group_id: group.id,
    order_id: orderId,
  }));

  const { error: membersError } = await supabase
    .from("match_group_members")
    .insert(members);

  if (membersError) {
    return { error: "ไม่สามารถเพิ่มสมาชิกในกลุ่มได้" };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "matched" })
    .in("id", orderIds);

  if (updateError) {
    return { error: "ไม่สามารถอัปเดตสถานะออเดอร์ได้" };
  }

  revalidatePath("/admin/matching");
  return { success: true };
}

export async function updateMatchGroupStatus(
  groupId: string,
  status: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("match_groups")
    .update({ status })
    .eq("id", groupId);

  if (error) {
    return { error: "ไม่สามารถอัปเดตสถานะกลุ่มได้" };
  }

  if (status === "printing" || status === "completed") {
    const { data: members } = await supabase
      .from("match_group_members")
      .select("order_id")
      .eq("match_group_id", groupId);

    if (members) {
      const orderIds = members.map((m) => m.order_id);
      await supabase
        .from("orders")
        .update({ status })
        .in("id", orderIds);
    }
  }

  revalidatePath("/admin/matching");
  return { success: true };
}
