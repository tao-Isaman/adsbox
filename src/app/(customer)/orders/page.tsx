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
      <h1 className="text-2xl font-bold">My Orders</h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        Track the status of your ad orders.
      </p>

      {(!orders || orders.length === 0) && (
        <p className="mt-8 text-center text-zinc-400">
          No orders yet. Browse our{" "}
          <a href="/packages" className="underline">
            packages
          </a>{" "}
          to get started.
        </p>
      )}

      {orders && orders.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-medium">Package</th>
                <th className="px-4 py-3 font-medium">Boxes</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
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
                    className="bg-white dark:bg-zinc-900/50"
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
                      {new Date(order.created_at).toLocaleDateString()}
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
