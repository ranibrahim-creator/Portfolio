"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { scaleMacros } from "@/lib/calculations";
import {
  mockDailyLog,
  mockFavorites,
  mockFoods,
  mockRecents,
  mockUser,
  unitLabel,
  type Food,
  type LogEntry,
  type MealType,
  type User,
} from "@/lib/mockData";
import { createId } from "@/lib/utils";

type AppState = {
  user: User;
  entries: LogEntry[];
  recents: string[];
  favorites: string[];
  updateUser: (patch: Partial<User>) => void;
  addFood: (food: Food, servings: number, meal: MealType, mode: "local" | "grams") => void;
  removeEntry: (id: string) => void;
  toggleFavorite: (foodId: string) => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(mockUser);
  const [entries, setEntries] = useState(mockDailyLog);
  const [recents, setRecents] = useState(mockRecents);
  const [favorites, setFavorites] = useState(mockFavorites);

  const value = useMemo<AppState>(
    () => ({
      user,
      entries,
      recents,
      favorites,
      updateUser: (patch) => setUser((current) => ({ ...current, ...patch })),
      addFood: (food, servings, meal, mode) => {
        const amount = mode === "grams" ? servings / food.gramsPerUnit : servings;
        const macros = scaleMacros(foodToMacros(food), amount);
        const label =
          mode === "grams"
            ? `${Math.round(servings)} g`
            : `${prettyQty(amount)} ${amount === 1 ? unitLabel[food.unit] : `${unitLabel[food.unit]}s`}`;
        setEntries((current) => [
          ...current,
          {
            id: createId(),
            foodId: food.id,
            name: food.name,
            nameArabic: food.nameArabic,
            meal,
            servings: amount,
            unitLabel: label,
            ...macros,
          },
        ]);
        setRecents((current) => [food.id, ...current.filter((id) => id !== food.id)].slice(0, 8));
      },
      removeEntry: (id) => setEntries((current) => current.filter((entry) => entry.id !== id)),
      toggleFavorite: (foodId) =>
        setFavorites((current) =>
          current.includes(foodId) ? current.filter((id) => id !== foodId) : [foodId, ...current],
        ),
    }),
    [user, entries, recents, favorites],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}

export function foodById(id: string) {
  return mockFoods.find((food) => food.id === id);
}

function foodToMacros(food: Food) {
  return {
    calories: food.caloriesPerUnit,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
  };
}

function prettyQty(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}
