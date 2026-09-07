import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { getRateSettings } from "@/actions/settings";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const rateResult = await getRateSettings();
  const rates = rateResult.success ? rateResult.data : null;

  return (
    <div className="flex min-h-screen bg-[#faf8f5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-amber-500 selection:text-white dark:selection:text-slate-950 transition-colors duration-200">
      {/* Sidebar for Desktop */}
      <Sidebar user={session.user} shopName={rates?.shopName} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Navbar user={session.user} rates={rates} />
        <main className="flex-1 p-3 sm:p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
