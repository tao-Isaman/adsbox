import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { CreateQuotationButton } from "./create-quotation-button";
import { ConfirmPaymentButton } from "./confirm-payment-button";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles:customer_id (customer_name, company_name, tel),
      packages:package_id (name, box_amount, price)
    `
    )
    .order("created_at", { ascending: false });

  const allOrders = orders ?? [];

  // Fetch quotations
  const orderIds = allOrders.map((o: { id: string }) => o.id);
  const { data: quotations } =
    orderIds.length > 0
      ? await supabase
          .from("quotations")
          .select("order_id, quotation_number, amount")
          .in("order_id", orderIds)
      : { data: [] };

  const quotationsByOrderId = (quotations ?? []).reduce(
    (
      acc: Record<string, { quotation_number: string; amount: number }>,
      q: { order_id: string; quotation_number: string; amount: number }
    ) => {
      acc[q.order_id] = q;
      return acc;
    },
    {} as Record<string, { quotation_number: string; amount: number }>
  );

  const totalOrders = allOrders.length;
  const statusCounts = allOrders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">แดชบอร์ดคำสั่งซื้อ</h1>

      {/* สถิติ */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard label="ทั้งหมด" value={totalOrders} />
        <StatCard label="รอดำเนินการ" value={statusCounts.pending ?? 0} />
        <StatCard label="เสนอราคาแล้ว" value={statusCounts.quoted ?? 0} />
        <StatCard label="ชำระเงินแล้ว" value={statusCounts.paid ?? 0} />
        <StatCard label="จับคู่แล้ว" value={statusCounts.matched ?? 0} />
        <StatCard label="เสร็จสิ้น" value={statusCounts.completed ?? 0} />
      </div>

      {/* ตารางคำสั่งซื้อ */}
      <div className="mt-8 overflow-hidden rounded-lg border border-zinc-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-medium">ลูกค้า</th>
              <th className="px-4 py-3 font-medium">บริษัท</th>
              <th className="px-4 py-3 font-medium">แพ็กเกจ</th>
              <th className="px-4 py-3 font-medium">ใบเสนอราคา</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium">วันที่</th>
              <th className="px-4 py-3 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {allOrders.map(
              (order: {
                id: string;
                status: string;
                contact_person?: string | null;
                company_name?: string | null;
                created_at: string;
                profiles: {
                  customer_name: string | null;
                  company_name: string | null;
                  tel: string | null;
                } | null;
                packages: {
                  name: string;
                  box_amount: number;
                  price: number;
                } | null;
              }) => {
                const quotation = quotationsByOrderId[order.id] ?? null;

                return (
                  <tr key={order.id} className="bg-white">
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {order.contact_person ??
                          order.profiles?.customer_name ??
                          "ไม่ระบุ"}
                      </p>
                      {order.profiles?.tel && (
                        <p className="text-xs text-zinc-400">
                          {order.profiles.tel}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {order.company_name ??
                        order.profiles?.company_name ??
                        "-"}
                    </td>
                    <td className="px-4 py-3">
                      <p>{order.packages?.name ?? "-"}</p>
                      {order.packages && (
                        <p className="text-xs text-zinc-400">
                          {new Intl.NumberFormat("th-TH", {
                            style: "currency",
                            currency: "THB",
                            minimumFractionDigits: 0,
                          }).format(order.packages.price)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {quotation ? (
                        <div>
                          <p className="text-xs text-zinc-400">
                            {quotation.quotation_number}
                          </p>
                          <p className="font-medium">
                            {new Intl.NumberFormat("th-TH", {
                              style: "currency",
                              currency: "THB",
                              minimumFractionDigits: 0,
                            }).format(quotation.amount)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-zinc-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(order.created_at).toLocaleDateString("th-TH")}
                    </td>
                    <td className="px-4 py-3">
                      {order.status === "pending" && (
                        <CreateQuotationButton
                          orderId={order.id}
                          packagePrice={order.packages?.price ?? 0}
                        />
                      )}
                      {order.status === "quoted" && (
                        <ConfirmPaymentButton orderId={order.id} />
                      )}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
