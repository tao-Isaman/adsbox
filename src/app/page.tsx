import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, onboarding_completed")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") redirect("/admin/dashboard");
    if (!profile?.onboarding_completed) redirect("/onboarding");
    redirect("/packages");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-lg dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100">
              <span className="text-sm font-bold text-white dark:text-zinc-900">
                A
              </span>
            </div>
            <span className="text-xl font-bold">AdsBox</span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="#packages"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 sm:block dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              แพ็กเกจ
            </a>
            <a
              href="#how-it-works"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 sm:block dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              วิธีการทำงาน
            </a>
            <Link
              href="/login"
              className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-900/10" />
          <div className="absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-purple-100/50 blur-3xl dark:bg-purple-900/10" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-20 pt-24 sm:pt-32 lg:pt-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              เปิดรับลูกค้าใหม่แล้ววันนี้
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              โฆษณาแบรนด์ของคุณ
              <br />
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                บนกล่องพัสดุทั่วประเทศ
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              AdsBox เปลี่ยนกล่องพัสดุธรรมดาให้กลายเป็นสื่อโฆษณาที่เข้าถึงลูกค้าได้โดยตรง
              โลโก้ของคุณจะถูกพิมพ์บนกล่องนับหมื่นใบ ส่งตรงถึงมือผู้บริโภค
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="w-full rounded-xl bg-zinc-900 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-zinc-900/20 transition hover:bg-zinc-800 sm:w-auto dark:bg-zinc-100 dark:text-zinc-900 dark:shadow-zinc-100/10 dark:hover:bg-zinc-200"
              >
                เริ่มต้นใช้งานฟรี
              </Link>
              <a
                href="#packages"
                className="w-full rounded-xl border border-zinc-300 px-8 py-3.5 text-base font-medium transition hover:bg-zinc-50 sm:w-auto dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                ดูแพ็กเกจทั้งหมด
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-3 gap-8 border-t border-zinc-200 pt-10 dark:border-zinc-800">
            <StatItem value="10,000+" label="กล่องขั้นต่ำ" />
            <StatItem value="4 แบรนด์" label="ต่อ 1 กล่อง" />
            <StatItem value="฿1.40" label="ต่อกล่อง เริ่มต้น" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-zinc-200 bg-zinc-50 py-24 dark:border-zinc-800 dark:bg-zinc-900/50"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              ขั้นตอนง่ายๆ
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              วิธีการทำงาน
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-500 dark:text-zinc-400">
              เพียง 3 ขั้นตอน โลโก้ของคุณก็จะปรากฏบนกล่องพัสดุ
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <StepCard
              step="01"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              }
              title="สมัครสมาชิก"
              description="ลงทะเบียนด้วยบัญชี Google กรอกข้อมูลบริษัทและช่องทางติดต่อ ใช้เวลาไม่ถึง 2 นาที"
            />
            <StepCard
              step="02"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              }
              title="เลือกแพ็กเกจ"
              description="เลือกจำนวนกล่องที่ต้องการตั้งแต่ 10,000 ถึง 50,000+ กล่อง ตามงบประมาณของคุณ"
            />
            <StepCard
              step="03"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12Zm-3 0h.008v.008h-.008V12Z"
                  />
                </svg>
              }
              title="พิมพ์ลงกล่อง"
              description="เราจัดกลุ่ม 4 แบรนด์ต่อกล่อง และพิมพ์โปสเตอร์โฆษณาของคุณลงบนกล่องพัสดุ"
            />
          </div>
        </div>
      </section>

      {/* Packages / Pricing */}
      <section id="packages" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              ราคา
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              แพ็กเกจโฆษณา
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-500 dark:text-zinc-400">
              เลือกแพ็กเกจที่เหมาะกับธุรกิจของคุณ ยิ่งสั่งมากยิ่งคุ้ม
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <PricingCard
              name="Starter"
              boxes="10,000"
              price="14,000"
              perBox="1.40"
              popular={false}
            />
            <PricingCard
              name="Growth"
              boxes="30,000"
              price="39,000"
              perBox="1.30"
              popular={true}
            />
            <PricingCard
              name="Scale"
              boxes="50,000"
              price="60,000"
              perBox="1.20"
              popular={false}
            />
            <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Enterprise
                </p>
                <p className="mt-4 text-3xl font-bold">50,000+</p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  กล่อง
                </p>
                <div className="mt-6 space-y-3">
                  <Feature text="จำนวนกล่องตามต้องการ" />
                  <Feature text="ราคาพิเศษตามปริมาณ" />
                  <Feature text="ผู้จัดการบัญชีส่วนตัว" />
                  <Feature text="ออกแบบกล่องเฉพาะ" />
                </div>
              </div>
              <a
                href="mailto:contact@adsbox.com"
                className="mt-8 block w-full rounded-xl border border-zinc-300 py-3 text-center text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                ติดต่อฝ่ายขาย
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why AdsBox */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-24 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              ทำไมต้อง AdsBox
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              ข้อดีของการโฆษณาบนกล่องพัสดุ
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <BenefitCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              }
              title="เข้าถึงกลุ่มเป้าหมายโดยตรง"
              description="กล่องพัสดุถูกส่งถึงมือผู้บริโภคโดยตรง มั่นใจว่าโฆษณาของคุณจะถูกมองเห็น"
            />
            <BenefitCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              }
              title="ราคาประหยัด"
              description="เริ่มต้นเพียง ฿1.40 ต่อกล่อง ถูกกว่าสื่อโฆษณาอื่นหลายเท่าตัว"
            />
            <BenefitCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
                  />
                </svg>
              }
              title="วัดผลได้"
              description="ติดตามสถานะคำสั่งซื้อแบบเรียลไทม์ผ่านแดชบอร์ดของคุณ"
            />
            <BenefitCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
              }
              title="น่าเชื่อถือ"
              description="โลโก้ของคุณจะปรากฏบนกล่องที่ลูกค้าเชื่อมั่น สร้างความไว้วางใจให้แบรนด์"
            />
            <BenefitCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                  />
                </svg>
              }
              title="ง่ายและรวดเร็ว"
              description="สมัครและสั่งซื้อออนไลน์ ไม่ต้องติดต่อพนักงาน เริ่มต้นได้ภายในไม่กี่นาที"
            />
            <BenefitCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>
              }
              title="4 แบรนด์ต่อกล่อง"
              description="แชร์พื้นที่โฆษณากับ 3 แบรนด์อื่น ช่วยลดต้นทุนและเพิ่มการมองเห็น"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl bg-zinc-900 px-8 py-16 text-center dark:bg-zinc-100 sm:px-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl dark:text-zinc-900">
              พร้อมเริ่มโฆษณาแล้วหรือยัง?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-300 dark:text-zinc-600">
              สมัครฟรีวันนี้ เลือกแพ็กเกจ แล้วให้เราดูแลการพิมพ์โลโก้ของคุณลงบนกล่อง
            </p>
            <Link
              href="/login"
              className="mt-8 inline-block rounded-xl bg-white px-8 py-3.5 text-base font-medium text-zinc-900 shadow-lg transition hover:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              สมัครสมาชิกฟรี
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 dark:bg-zinc-100">
                <span className="text-xs font-bold text-white dark:text-zinc-900">
                  A
                </span>
              </div>
              <span className="font-bold">AdsBox</span>
            </div>
            <div className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
              <a
                href="mailto:contact@adsbox.com"
                className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                ติดต่อเรา
              </a>
              <a
                href="#packages"
                className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                แพ็กเกจ
              </a>
              <a
                href="#how-it-works"
                className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                วิธีการทำงาน
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-400 dark:border-zinc-800">
            &copy; {new Date().getFullYear()} AdsBox. สงวนลิขสิทธิ์ทุกประการ
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ──────────────────── Sub-components ──────────────────── */

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
      <span className="absolute right-6 top-6 text-4xl font-bold text-zinc-100 dark:text-zinc-800">
        {step}
      </span>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}

function PricingCard({
  name,
  boxes,
  price,
  perBox,
  popular,
}: {
  name: string;
  boxes: string;
  price: string;
  perBox: string;
  popular: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border p-6 ${
        popular
          ? "border-blue-500 bg-white shadow-lg shadow-blue-500/10 dark:border-blue-400 dark:bg-zinc-900"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
          ยอดนิยม
        </span>
      )}
      <div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {name}
        </p>
        <p className="mt-4 text-3xl font-bold">{boxes}</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">กล่อง</p>
        <div className="mt-6 space-y-3">
          <Feature text={`ราคา ฿${price}`} />
          <Feature text={`เฉลี่ย ฿${perBox} / กล่อง`} />
          <Feature text="4 แบรนด์ต่อกล่อง" />
          <Feature text="ติดตามสถานะออนไลน์" />
        </div>
      </div>
      <Link
        href="/login"
        className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-medium transition ${
          popular
            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600"
            : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        }`}
      >
        เลือกแพ็กเกจนี้
      </Link>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      <svg
        className="h-4 w-4 shrink-0 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>
      {text}
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}
