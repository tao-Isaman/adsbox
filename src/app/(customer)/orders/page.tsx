import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      packages (name, box_amount, price)
    `
    )
    .eq("customer_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold">คำสั่งซื้อของฉัน</h1>
      <p className="mt-2 text-zinc-500">
        ติดตามสถานะคำสั่งซื้อโฆษณาของคุณ
      </p>

      {(!orders || orders.length === 0) && (
        <p className="mt-8 text-center text-zinc-400">
          ยังไม่มีคำสั่งซื้อ เลือกดู{" "}
          <a href="/packages" className="text-orange-500 underline">
            แพ็กเกจ
          </a>{" "}
          เพื่อเริ่มต้น
        </p>
      )}

      {orders && orders.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-medium">แพ็กเกจ</th>
                <th className="px-4 py-3 font-medium">จำนวนกล่อง</th>
                <th className="px-4 py-3 font-medium">ราคา</th>
                <th className="px-4 py-3 font-medium">สถานะ</th>
                <th className="px-4 py-3 font-medium">วันที่</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {orders.map(
                (order: {
                  id: string;
                  status: string;
                  created_at: string;
                  packages: {
                    name: string;
                    box_amount: number;
                    price: number;
                  };
                }) => (
                  <tr
                    key={order.id}
                    className="bg-white"
                  >
                    <td className="px-4 py-3 font-medium">
                      {order.packages.name}
                    </td>
                    <td className="px-4 py-3">
                      {order.packages.box_amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Intl.NumberFormat("th-TH", {
                        style: "currency",
                        currency: "THB",
                        minimumFractionDigits: 0,
                      }).format(order.packages.price)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(order.created_at).toLocaleDateString("th-TH")}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
