import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CustomerNav } from "@/components/customer-nav";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("customer_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-zinc-50">
      <CustomerNav
        userName={profile?.customer_name ?? user.email ?? "User"}
      />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
