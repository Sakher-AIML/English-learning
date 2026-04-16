import Link from "next/link";
import { BookOpen, LayoutDashboard, MessageCircleMore, Mic2, Trophy } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/conversation", label: "Chat", icon: MessageCircleMore },
  { href: "/flashcards", label: "Cards", icon: BookOpen },
  { href: "/pronunciation", label: "Speak", icon: Mic2 },
  { href: "/progress", label: "Stats", icon: Trophy },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-surface px-2 py-2 lg:hidden">
      <ul className="grid grid-cols-5 gap-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold text-text-2"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
