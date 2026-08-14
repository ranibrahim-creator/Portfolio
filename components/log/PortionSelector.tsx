"use client";

import { Minus, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scaleMacros } from "@/lib/calculations";
import type { Food, MealType } from "@/lib/mockData";
import { unitLabel } from "@/lib/mockData";
import { useApp } from "@/lib/store";
import { formatGrams, formatKcal } from "@/lib/utils";

const MEALS: { id: MealType; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snacks", label: "Snacks" },
];

export function PortionSelector({ food }: { food: Food }) {
  const router = useRouter();
  const params = useSearchParams();
  const { addFood } = useApp();
  const [mode, setMode] = useState<"local" | "grams">("local");
  const [qty, setQty] = useState(1);
  const [meal, setMeal] = useState<MealType>((params.get("meal") as MealType) || "lunch");

  const servings = mode === "grams" ? qty : qty;
  const macros = useMemo(
    () => scaleMacros(
      { calories: food.caloriesPerUnit, protein: food.protein, carbs: food.carbs, fat: food.fat },
      mode === "grams" ? qty / food.gramsPerUnit : qty,
    ),
    [food, mode, qty],
  );

  const step = mode === "grams" ? 10 : 0.5;
  const min = mode === "grams" ? 10 : 0.5;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 rounded-full border border-border p-1">
        {(["local", "grams"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setMode(item);
              setQty(item === "grams" ? food.gramsPerUnit : 1);
            }}
            className={`h-10 rounded-full text-sm font-semibold transition-colors duration-200 ease-out ${
              mode === item ? "bg-white text-black" : "text-muted"
            }`}
          >
            {item === "local" ? "Local unit" : "Grams"}
          </button>
        ))}
      </div>

      <div>
        <Label>Quantity</Label>
        <div className="mt-2 flex items-center justify-between rounded-xl border border-border px-3">
          <button type="button" className="flex h-12 w-12 items-center justify-center" onClick={() => setQty((value) => Math.max(min, Math.round((value - step) * 10) / 10))}>
            <Minus className="h-4 w-4" />
          </button>
          <p className="text-2xl font-semibold tabular-nums">
            {mode === "grams" ? `${qty} g` : `${qty} ${qty === 1 ? unitLabel[food.unit] : `${unitLabel[food.unit]}s`}`}
          </p>
          <button type="button" className="flex h-12 w-12 items-center justify-center" onClick={() => setQty((value) => Math.round((value + step) * 10) / 10)}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 rounded-xl border border-border p-4 text-center">
        <MacroStat label="kcal" value={formatKcal(macros.calories)} />
        <MacroStat label="P" value={`${formatGrams(macros.protein)}g`} />
        <MacroStat label="C" value={`${formatGrams(macros.carbs)}g`} />
        <MacroStat label="F" value={`${formatGrams(macros.fat)}g`} />
      </div>

      <div>
        <Label>Meal</Label>
        <Select value={meal} onValueChange={(value) => setMeal(value as MealType)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MEALS.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="sticky bottom-20 bg-background pt-2">
        <Button
          className="w-full"
          onClick={() => {
            addFood(food, servings, meal, mode);
            router.push("/");
          }}
        >
          Add to log
        </Button>
      </div>
    </div>
  );
}

function MacroStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-base font-semibold tabular-nums">{value}</p>
      <p className="text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
    </div>
  );
}
