import Link from "next/link";
import { Flame, LayoutDashboard, MessageCircleMore, Mic2, Trophy, BookOpen } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/conversation", label: "Conversation", icon: MessageCircleMore },
  { href: "/flashcards", label: "Flashcards", icon: BookOpen },
  { href: "/pronunciation", label: "Pronunciation", icon: Mic2 },
  { href: "/progress", label: "Progress", icon: Trophy },
];

export function Sidebar() {
  return (
    <aside className="sticky top-4 mr-4 hidden h-[calc(100vh-2rem)] w-60 shrink-0 rounded-2xl border bg-surface p-4 shadow-sm lg:flex lg:flex-col">
      <h2 className="text-2xl font-extrabold text-primary">LinguaAI</h2>

      <nav className="mt-8 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-semibold text-text-2 transition hover:bg-surface-2 hover:text-text-1"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-surface-2 p-3">
        <p className="text-sm font-semibold">Learner</p>
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-2">
          <Flame className="h-3 w-3 text-secondary" /> 7 day streak
        </p>
      </div>
    </aside>
  );
}
