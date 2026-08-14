import Link from "next/link";

import type { Food } from "@/lib/mockData";
import { formatKcal } from "@/lib/utils";

export function FoodListItem({ food, meal }: { food: Food; meal?: string }) {
  const href = meal ? `/log/${food.id}?meal=${meal}` : `/log/${food.id}`;

  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-border bg-surface p-6 transition-colors duration-200 ease-out hover:border-accent"
    >
      <div>
        <p className="font-medium">{food.name}</p>
        <p className="text-sm text-muted" dir="rtl">
          {food.nameArabic}
        </p>
      </div>
      <p className="text-base font-semibold tabular-nums">{formatKcal(food.caloriesPerUnit)}</p>
    </Link>
  );
}
