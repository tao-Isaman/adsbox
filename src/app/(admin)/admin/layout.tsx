import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";

export default async function AdminLayout({
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
    .select("role, customer_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/packages");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        userName={profile?.customer_name ?? user.email ?? "Admin"}
      />
      <main className="flex-1 bg-zinc-50 p-8 dark:bg-zinc-950">
        {children}
      </main>
    </div>
  );
}
