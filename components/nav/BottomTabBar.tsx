"use client";

import { Home, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/log", label: "Log", icon: Plus, elevated: true },
  { href: "/progress", label: "Progress", icon: TrendingUp },
];

export function BottomTabBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/onboarding")) return null;

  return (
    <nav className="sticky bottom-0 z-20 border-t border-border bg-surface/95 px-6 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <div className="flex items-end justify-between">
        {tabs.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          if (tab.elevated) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="-mt-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white text-black shadow-none transition-colors duration-200 ease-out hover:bg-neutral-200"
                aria-label={tab.label}
              >
                <Icon className="h-6 w-6" />
              </Link>
            );
          }
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-1 py-1 text-xs font-medium transition-colors duration-200 ease-out ${
                active ? "text-white" : "text-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
