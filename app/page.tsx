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
    <>
      <main className="px-6 pb-48 pt-6">
        <header className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">{todayLabel()}</p>
            <h1 className="text-2xl font-semibold">
              {greeting()}, {user.name}
            </h1>
          </div>
          <Link
            href="/profile"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-sm font-semibold"
            aria-label="Open profile"
          >
            {user.name.slice(0, 1)}
          </Link>
        </header>

        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="flex justify-center">
            <CalorieRing consumed={consumed} goal={user.calorieGoal} />
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            <span className="tabular-nums font-medium text-foreground">{formatKcal(consumed)}</span> eaten of{" "}
            <span className="tabular-nums">{formatKcal(user.calorieGoal)}</span>
          </p>
          <div className="mt-6 space-y-4">
            <MacroBar label="Protein" value={protein} goal={user.proteinGoal} macro="protein" delay={0} />
            <MacroBar label="Carbs" value={carbs} goal={user.carbsGoal} macro="carbs" delay={80} />
            <MacroBar label="Fat" value={fat} goal={user.fatGoal} macro="fat" delay={160} />
          </div>
        </section>

        <div className="mt-4 space-y-4">
          {MEALS.map((meal) => (
            <MealSection key={meal} meal={meal} entries={entries.filter((entry) => entry.meal === meal)} />
          ))}
        </div>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-10 mx-auto flex w-full max-w-[480px] justify-end px-6">
        <Link
          href="/log"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black transition-colors duration-200 ease-out hover:bg-neutral-200"
          aria-label="Log food"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </div>
    </>
  );
}
