"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const customerName = formData.get("customer_name") as string;
  const tel = formData.get("tel") as string;
  const address = formData.get("address") as string;
  const companyName = formData.get("company_name") as string;

  if (!customerName || !tel) {
    return { error: "Customer name and phone number are required" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      customer_name: customerName,
      tel,
      address,
      company_name: companyName,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Failed to save profile. Please try again." };
  }

  redirect("/packages");
}
