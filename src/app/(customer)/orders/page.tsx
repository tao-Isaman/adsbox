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
      packages (name, box_amount, price),
      quotations (quotation_number, amount, valid_until)
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
        <div className="mt-6 space-y-4">
          {orders.map(
            (order: {
              id: string;
              status: string;
              contact_person: string | null;
              company_name: string | null;
              ad_details: string | null;
              created_at: string;
              packages: {
                name: string;
                box_amount: number;
                price: number;
              };
              quotations: {
                quotation_number: string;
                amount: number;
                valid_until: string | null;
              }[];
            }) => {
              const quotation = order.quotations?.[0] ?? null;

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-zinc-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{order.packages.name}</h3>
                      <p className="text-sm text-zinc-500">
                        {order.packages.box_amount.toLocaleString()} กล่อง
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Order details */}
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-zinc-400">ผู้ติดต่อ</p>
                      <p className="font-medium">
                        {order.contact_person ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-400">บริษัท</p>
                      <p className="font-medium">
                        {order.company_name ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-400">วันที่สั่งซื้อ</p>
                      <p className="font-medium">
                        {new Date(order.created_at).toLocaleDateString("th-TH")}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-400">ราคาแพ็กเกจ</p>
                      <p className="font-medium">
                        {new Intl.NumberFormat("th-TH", {
                          style: "currency",
                          currency: "THB",
                          minimumFractionDigits: 0,
                        }).format(order.packages.price)}
                      </p>
                    </div>
                  </div>

                  {/* Quotation details */}
                  {quotation && (
                    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-blue-600">
                            ใบเสนอราคา
                          </p>
                          <p className="text-sm font-semibold">
                            {quotation.quotation_number}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-blue-700">
                          {new Intl.NumberFormat("th-TH", {
                            style: "currency",
                            currency: "THB",
                            minimumFractionDigits: 0,
                          }).format(quotation.amount)}
                        </p>
                      </div>
                      {quotation.valid_until && (
                        <p className="mt-1 text-xs text-blue-500">
                          ใช้ได้ถึง{" "}
                          {new Date(quotation.valid_until).toLocaleDateString(
                            "th-TH"
                          )}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Ad details */}
                  {order.ad_details && (
                    <div className="mt-3">
                      <p className="text-xs text-zinc-400">
                        รายละเอียดโฆษณา
                      </p>
                      <p className="mt-1 text-sm text-zinc-600">
                        {order.ad_details}
                      </p>
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
