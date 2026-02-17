import { createClient } from "@/lib/supabase/server";
import { MatchingInterface } from "@/components/matching-interface";

export default async function AdminMatchingPage() {
  const supabase = await createClient();

  const { data: unmatchedOrders } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles:customer_id (customer_name, company_name),
      packages:package_id (name, box_amount, price)
    `
    )
    .eq("status", "paid")
    .order("created_at", { ascending: true });

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
      <h1 className="text-2xl font-bold">ระบบจับคู่</h1>
      <p className="mt-2 text-zinc-500">
        จัดกลุ่มลูกค้า 4 รายที่ซื้อแพ็กเกจเดียวกันเพื่อพิมพ์โลโก้ลงกล่อง
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
