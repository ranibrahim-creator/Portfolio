"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import type { MealType, RestaurantItem } from "@/lib/mockData";
import { useApp } from "@/lib/store";
import { formatKcal } from "@/lib/utils";

export function RestaurantListItem({ item, meal }: { item: RestaurantItem; meal: MealType }) {
  const { addRestaurantItem } = useApp();
  const [added, setAdded] = useState(false);

  const quickAdd = () => {
    addRestaurantItem(item, meal);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 900);
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-5">
      <div className="min-w-0">
        <p className="font-medium">{item.itemName}</p>
        {item.itemNameArabic ? (
          <p className="text-sm text-muted" dir="rtl">
            {item.itemNameArabic}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <p className="text-base font-semibold tabular-nums">{formatKcal(item.calories)}</p>
        <button
          type="button"
          onClick={quickAdd}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black transition-colors duration-200 ease-out hover:bg-neutral-200"
          aria-label={`Add ${item.itemName}`}
        >
          {added ? <span className="text-sm font-semibold">✓</span> : <Plus className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
