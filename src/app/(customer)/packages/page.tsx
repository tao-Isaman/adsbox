import { createClient } from "@/lib/supabase/server";
import { PackageCard } from "@/components/package-card";
import type { Package } from "@/lib/supabase/types";

export default async function PackagesPage() {
  const supabase = await createClient();

  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .order("box_amount", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-bold">แพ็กเกจโฆษณา</h1>
      <p className="mt-2 text-zinc-500">
        เลือกแพ็กเกจเพื่อพิมพ์โลโก้ของคุณลงบนกล่องของเรา
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {(packages as Package[] | null)?.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
}
