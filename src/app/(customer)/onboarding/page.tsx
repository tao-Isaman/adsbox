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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Please fill in your details to get started with AdsBox.
          </p>
        </div>

        {state?.error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-400">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="customer_name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Name *
            </label>
            <input
              id="customer_name"
              name="customer_name"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Company Name
            </label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="Your company name"
            />
          </div>

          <div>
            <label
              htmlFor="tel"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Phone Number *
            </label>
            <input
              id="tel"
              name="tel"
              type="tel"
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="08X-XXX-XXXX"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="Your address"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {isPending ? "Saving..." : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}
