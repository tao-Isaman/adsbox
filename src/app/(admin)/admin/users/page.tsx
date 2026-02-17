import { createClient } from "@/lib/supabase/server";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const allProfiles = profiles ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold">จัดการผู้ใช้</h1>
      <p className="mt-2 text-zinc-500">
        ผู้ใช้ที่ลงทะเบียนทั้งหมด {allProfiles.length} คน
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-medium">ชื่อ</th>
              <th className="px-4 py-3 font-medium">บริษัท</th>
              <th className="px-4 py-3 font-medium">เบอร์โทร</th>
              <th className="px-4 py-3 font-medium">ที่อยู่</th>
              <th className="px-4 py-3 font-medium">บทบาท</th>
              <th className="px-4 py-3 font-medium">ลงทะเบียน</th>
              <th className="px-4 py-3 font-medium">วันที่สมัคร</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {allProfiles.map(
              (profile: {
                id: string;
                customer_name: string | null;
                company_name: string | null;
                tel: string | null;
                address: string | null;
                role: string;
                onboarding_completed: boolean;
                created_at: string;
              }) => (
                <tr
                  key={profile.id}
                  className="bg-white"
                >
                  <td className="px-4 py-3 font-medium">
                    {profile.customer_name ?? "ไม่ระบุ"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {profile.company_name ?? "-"}
                  </td>
                  <td className="px-4 py-3">{profile.tel ?? "-"}</td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-zinc-500">
                    {profile.address ?? "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        profile.role === "admin"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-zinc-100 text-zinc-800"
                      }`}
                    >
                      {profile.role === "admin" ? "แอดมิน" : "ลูกค้า"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {profile.onboarding_completed ? (
                      <span className="text-green-600">
                        แล้ว
                      </span>
                    ) : (
                      <span className="text-zinc-400">ยังไม่</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(profile.created_at).toLocaleDateString("th-TH")}
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
