"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

import { CalorieRing } from "@/components/dashboard/CalorieRing";
import { MacroBar } from "@/components/dashboard/MacroBar";
import { MealSection } from "@/components/dashboard/MealSection";
import { useApp } from "@/lib/store";
import { formatKcal, greeting, todayLabel } from "@/lib/utils";
import type { MealType } from "@/lib/mockData";

const MEALS: MealType[] = ["breakfast", "lunch", "dinner", "snacks"];

export default function HomePage() {
  const { user, entries } = useApp();
  const consumed = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const protein = entries.reduce((sum, entry) => sum + entry.protein, 0);
  const carbs = entries.reduce((sum, entry) => sum + entry.carbs, 0);
  const fat = entries.reduce((sum, entry) => sum + entry.fat, 0);

  return (
    <main className="px-5 pb-28 pt-6">
      <header className="mb-6">
        <p className="text-sm text-muted">{todayLabel()}</p>
        <h1 className="text-2xl font-semibold">
          {greeting()}, {user.name}
        </h1>
      </header>

      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="flex justify-center">
          <CalorieRing consumed={consumed} goal={user.calorieGoal} />
        </div>
        <p className="mt-4 text-center text-sm text-muted">
          <span className="tabular-nums font-medium text-foreground">{formatKcal(consumed)}</span> eaten of{" "}
          <span className="tabular-nums">{formatKcal(user.calorieGoal)}</span>
        </p>
        <div className="mt-6 space-y-4">
          <MacroBar label="Protein" value={protein} goal={user.proteinGoal} delay={0} />
          <MacroBar label="Carbs" value={carbs} goal={user.carbsGoal} delay={80} />
          <MacroBar label="Fat" value={fat} goal={user.fatGoal} delay={160} />
        </div>
      </section>

      <div className="mt-5 space-y-3">
        {MEALS.map((meal) => (
          <MealSection key={meal} meal={meal} entries={entries.filter((entry) => entry.meal === meal)} />
        ))}
      </div>

      <div className="pointer-events-none sticky bottom-24 z-10 flex justify-end">
        <Link
          href="/log"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white transition-colors duration-200 ease-out hover:bg-accent-hover"
          aria-label="Log food"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </div>
    </main>
  );
}
