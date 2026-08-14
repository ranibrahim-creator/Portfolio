"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import type { LogEntry, MealType } from "@/lib/mockData";
import { useApp } from "@/lib/store";
import { formatKcal } from "@/lib/utils";

const MEALS: { id: MealType; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snacks", label: "Snacks" },
];

export function MealSection({ meal, entries }: { meal: MealType; entries: LogEntry[] }) {
  const { removeEntry } = useApp();
  const [open, setOpen] = useState(true);
  const meta = MEALS.find((item) => item.id === meal)!;
  const calories = entries.reduce((sum, entry) => sum + entry.calories, 0);

  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between"
      >
        <div className="text-left">
          <p className="text-base font-semibold">{meta.label}</p>
          <p className="text-sm tabular-nums text-muted">{formatKcal(calories)} kcal</p>
        </div>
        <ChevronDown className={`h-5 w-5 text-muted transition-transform duration-200 ease-out ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-4 space-y-2">
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <SwipeRow key={entry.id} onDelete={() => removeEntry(entry.id)}>
                <p className="font-medium">{entry.name}</p>
                <p className="text-sm text-muted">
                  {entry.unitLabel}
                  <span className="mx-1">·</span>
                  <span className="tabular-nums">{formatKcal(entry.calories)} kcal</span>
                </p>
              </SwipeRow>
            ))}
          </AnimatePresence>
          <Link
            href={`/log?meal=${meal}`}
            className="flex h-12 items-center gap-2 rounded-xl px-1 text-sm font-semibold text-accent transition-colors duration-200 ease-out hover:text-accent-hover"
          >
            <Plus className="h-4 w-4" />
            Add food
          </Link>
        </div>
      )}
    </section>
  );
}

function SwipeRow({ children, onDelete }: { children: ReactNode; onDelete: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-y-0 right-0 flex w-16 items-center justify-center bg-warning">
        <Trash2 className="h-4 w-4 text-white" />
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: -72, right: 0 }}
        dragElastic={0.04}
        onDragEnd={(_, info) => {
          if (info.offset.x < -56) onDelete();
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative rounded-xl border border-border bg-background p-4"
      >
        {children}
      </motion.div>
    </div>
  );
}
