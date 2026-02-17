"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createMatchGroup(name: string, orderIds: string[]) {
  if (orderIds.length !== 4) {
    return { error: "Exactly 4 orders are required for a match group" };
  }

  const supabase = await createClient();

  // Fetch orders to validate and get the package_id
  const { data: orders } = await supabase
    .from("orders")
    .select("id, package_id, status")
    .in("id", orderIds);

  if (!orders || orders.length !== 4) {
    return { error: "One or more orders not found" };
  }

  const packageId = orders[0].package_id;
  const allSamePackage = orders.every((o) => o.package_id === packageId);
  const allConfirmed = orders.every((o) => o.status === "confirmed");

  if (!allSamePackage) {
    return { error: "All orders must be from the same package" };
  }
  if (!allConfirmed) {
    return { error: "All orders must have confirmed status" };
  }

  // Create the match group
  const { data: group, error: groupError } = await supabase
    .from("match_groups")
    .insert({ name, package_id: packageId })
    .select()
    .single();

  if (groupError || !group) {
    return { error: "Failed to create match group" };
  }

  // Add members
  const members = orderIds.map((orderId) => ({
    match_group_id: group.id,
    order_id: orderId,
  }));

  const { error: membersError } = await supabase
    .from("match_group_members")
    .insert(members);

  if (membersError) {
    return { error: "Failed to add members to match group" };
  }

  // Update order statuses to 'matched'
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "matched" })
    .in("id", orderIds);

  if (updateError) {
    return { error: "Failed to update order statuses" };
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
    return { error: "Failed to update match group status" };
  }

  // Cascade status to member orders
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
