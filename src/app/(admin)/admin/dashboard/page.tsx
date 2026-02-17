import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/status-badge";
import { ConfirmOrderButton } from "./confirm-button";

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

  // Compute stats
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
      <h1 className="text-2xl font-bold">Order Dashboard</h1>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Orders" value={totalOrders} />
        <StatCard label="Pending" value={statusCounts.pending ?? 0} />
        <StatCard label="Confirmed" value={statusCounts.confirmed ?? 0} />
        <StatCard label="Matched" value={statusCounts.matched ?? 0} />
        <StatCard label="Completed" value={statusCounts.completed ?? 0} />
      </div>

      {/* Orders Table */}
      <div className="mt-8 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Package</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {allOrders.map(
              (order: {
                id: string;
                status: string;
                created_at: string;
                profiles: {
                  customer_name: string | null;
                  company_name: string | null;
                  tel: string | null;
                };
                packages: {
                  name: string;
                  box_amount: number;
                  price: number;
                };
              }) => (
                <tr key={order.id} className="bg-white dark:bg-zinc-900/50">
                  <td className="px-4 py-3 font-medium">
                    {order.profiles.customer_name ?? "N/A"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {order.profiles.company_name ?? "-"}
                  </td>
                  <td className="px-4 py-3">{order.packages.name}</td>
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
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {order.status === "pending" && (
                      <ConfirmOrderButton orderId={order.id} />
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
