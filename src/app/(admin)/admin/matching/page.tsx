import { createClient } from "@/lib/supabase/server";
import { MatchingInterface } from "@/components/matching-interface";

export default async function AdminMatchingPage() {
  const supabase = await createClient();

  // Get confirmed orders not yet in a match group
  const { data: unmatchedOrders } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles:customer_id (customer_name, company_name),
      packages:package_id (name, box_amount, price)
    `
    )
    .eq("status", "confirmed")
    .order("created_at", { ascending: true });

  // Get existing match groups with members
  const { data: matchGroups } = await supabase
    .from("match_groups")
    .select(
      `
      *,
      packages:package_id (name, box_amount),
      match_group_members (
        id,
        orders:order_id (
          id,
          poster_url,
          profiles:customer_id (customer_name, company_name)
        )
      )
    `
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold">Matching System</h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        Group 4 customers with the same package to print their logos on boxes.
      </p>
      <div className="mt-6">
        <MatchingInterface
          unmatchedOrders={(unmatchedOrders as never[]) ?? []}
          matchGroups={(matchGroups as never[]) ?? []}
        />
      </div>
    </div>
  );
}
