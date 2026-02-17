import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OrderForm } from "./order-form";

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const { package: packageId } = await searchParams;
  if (!packageId) redirect("/packages");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: pkg }, { data: profile }] = await Promise.all([
    supabase.from("packages").select("*").eq("id", packageId).single(),
    supabase
      .from("profiles")
      .select("customer_name, company_name, tel")
      .eq("id", user.id)
      .single(),
  ]);

  if (!pkg) redirect("/packages");

  const formattedPrice = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(pkg.price);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">สั่งซื้อโฆษณา</h1>
      <p className="mt-2 text-zinc-500">
        กรอกข้อมูลเพื่อส่งคำสั่งซื้อ ทีมงานจะติดต่อกลับเพื่อยืนยัน
      </p>

      {/* Package summary */}
      <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-orange-600">แพ็กเกจที่เลือก</p>
            <p className="mt-1 text-lg font-bold">{pkg.name}</p>
            <p className="text-sm text-zinc-500">
              {pkg.box_amount.toLocaleString()} กล่อง
            </p>
          </div>
          <p className="text-2xl font-bold text-orange-600">{formattedPrice}</p>
        </div>
      </div>

      <OrderForm
        packageId={pkg.id}
        defaultContactPerson={profile?.customer_name ?? ""}
        defaultCompanyName={profile?.company_name ?? ""}
        defaultContactTel={profile?.tel ?? ""}
      />
    </div>
  );
}
