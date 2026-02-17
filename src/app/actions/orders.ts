"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createOrder(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const packageId = formData.get("package_id") as string;
  const contactPerson = formData.get("contact_person") as string;
  const contactTel = formData.get("contact_tel") as string;
  const companyName = formData.get("company_name") as string;
  const adDetails = formData.get("ad_details") as string;

  if (!packageId || !contactPerson || !contactTel) {
    return { error: "กรุณากรอกชื่อผู้ติดต่อและเบอร์โทรศัพท์" };
  }

  const { error } = await supabase.from("orders").insert({
    customer_id: user.id,
    package_id: packageId,
    contact_person: contactPerson,
    contact_tel: contactTel,
    company_name: companyName || null,
    ad_details: adDetails || null,
    status: "pending",
  });

  if (error) {
    return { error: "ไม่สามารถสร้างคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง" };
  }

  revalidatePath("/orders");
  redirect("/orders");
}
