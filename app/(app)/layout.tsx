import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";

export default function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1280px] px-4 pb-24 pt-4 md:px-6 md:py-6">
      <Sidebar />
      <main className="w-full rounded-2xl border bg-surface p-4 shadow-sm md:p-6">{children}</main>
      <BottomNav />
    </div>
  );
}
