import { DailyReviewBanner } from "@/components/dashboard/DailyReviewBanner";
import { StatCard } from "@/components/dashboard/StatCard";
import { StreakBadge } from "@/components/dashboard/StreakBadge";
import { XPBar } from "@/components/dashboard/XPBar";

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-2">Good afternoon, Learner</p>
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
        </div>
        <StreakBadge days={7} />
      </header>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Words Learned" value="146" />
        <StatCard label="Conversations" value="28" />
        <StatCard label="Avg Score" value="82%" />
        <StatCard label="Study Time" value="6h 15m" />
      </div>

      <DailyReviewBanner dueCount={12} />
      <XPBar currentXP={780} nextLevelXP={1000} />
    </section>
  );
}
