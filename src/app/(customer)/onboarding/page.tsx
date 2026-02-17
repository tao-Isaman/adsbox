"use client";

import { useActionState } from "react";
import { completeOnboarding } from "@/app/actions/onboarding";

export default function OnboardingPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error: string } | null, formData: FormData) => {
      const result = await completeOnboarding(formData);
      return result ?? null;
    },
    null
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">กรอกข้อมูลของคุณ</h1>
          <p className="mt-2 text-sm text-zinc-500">
            กรุณากรอกข้อมูลเพื่อเริ่มต้นใช้งาน AdsBox
          </p>
        </div>

        {state?.error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="customer_name"
              className="block text-sm font-medium text-zinc-700"
            >
              ชื่อ-นามสกุล *
            </label>
            <input
              id="customer_name"
              name="customer_name"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="ชื่อ-นามสกุล"
            />
          </div>

          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-zinc-700"
            >
              ชื่อบริษัท
            </label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="ชื่อบริษัท"
            />
          </div>

          <div>
            <label
              htmlFor="tel"
              className="block text-sm font-medium text-zinc-700"
            >
              เบอร์โทรศัพท์ *
            </label>
            <input
              id="tel"
              name="tel"
              type="tel"
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="08X-XXX-XXXX"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-zinc-700"
            >
              ที่อยู่
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="ที่อยู่"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {isPending ? "กำลังบันทึก..." : "ลงทะเบียน"}
          </button>
        </form>
      </div>
    </div>
  );
}
