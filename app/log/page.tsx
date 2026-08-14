"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { FoodListItem } from "@/components/log/FoodListItem";
import { FoodSearchBar } from "@/components/log/FoodSearchBar";
import { RestaurantListItem } from "@/components/log/RestaurantListItem";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockFoods, mockRestaurants, type MealType } from "@/lib/mockData";
import { useApp } from "@/lib/store";

const MEALS: MealType[] = ["breakfast", "lunch", "dinner", "snacks"];

export default function LogPage() {
  return (
    <Suspense>
      <LogScreen />
    </Suspense>
  );
}

function LogScreen() {
  const params = useSearchParams();
  const mealParam = params.get("meal");
  const meal: MealType = MEALS.includes(mealParam as MealType) ? (mealParam as MealType) : "lunch";
  const { recents, favorites } = useApp();
  const [query, setQuery] = useState("");
  const [scanOpen, setScanOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return mockFoods.filter(
      (food) =>
        !needle ||
        food.name.toLowerCase().includes(needle) ||
        food.nameArabic.includes(query.trim()),
    );
  }, [query]);

  const restaurantGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const items = mockRestaurants.filter(
      (item) =>
        !needle ||
        item.itemName.toLowerCase().includes(needle) ||
        item.restaurantName.toLowerCase().includes(needle) ||
        (item.itemNameArabic ?? "").includes(query.trim()),
    );
    const groups = new Map<string, typeof items>();
    for (const item of items) {
      const list = groups.get(item.restaurantName) ?? [];
      list.push(item);
      groups.set(item.restaurantName, list);
    }
    return Array.from(groups.entries());
  }, [query]);

  const recentFoods = recents.map((id) => mockFoods.find((food) => food.id === id)).filter(Boolean);
  const favoriteFoods = favorites.map((id) => mockFoods.find((food) => food.id === id)).filter(Boolean);

  return (
    <main className="px-5 pb-28 pt-6">
      <h1 className="text-2xl font-semibold">Log food</h1>
      <FoodSearchBar value={query} onChange={setQuery} onScan={() => setScanOpen(true)} />

      <Tabs defaultValue="local" className="mt-2">
        <TabsList className="grid h-auto w-full grid-cols-4">
          <TabsTrigger value="local" className="px-1.5 text-[11px]">
            Local Dishes
          </TabsTrigger>
          <TabsTrigger value="recents" className="px-1.5 text-[11px]">
            Recents
          </TabsTrigger>
          <TabsTrigger value="restaurants" className="px-1.5 text-[11px]">
            Restaurants
          </TabsTrigger>
          <TabsTrigger value="favorites" className="px-1.5 text-[11px]">
            Favorites
          </TabsTrigger>
        </TabsList>
        <TabsContent value="local" className="space-y-2">
          {filtered.map((food) => (
            <FoodListItem key={food.id} food={food} meal={mealParam ?? undefined} />
          ))}
        </TabsContent>
        <TabsContent value="recents" className="space-y-2">
          {recentFoods.map((food) => food && <FoodListItem key={food.id} food={food} meal={mealParam ?? undefined} />)}
        </TabsContent>
        <TabsContent value="restaurants" className="space-y-5">
          {restaurantGroups.map(([restaurantName, items]) => (
            <section key={restaurantName} className="space-y-2">
              <h2 className="px-1 text-xs font-medium uppercase tracking-[0.14em] text-muted">{restaurantName}</h2>
              {items.map((item) => (
                <RestaurantListItem key={item.id} item={item} meal={meal} />
              ))}
            </section>
          ))}
        </TabsContent>
        <TabsContent value="favorites" className="space-y-2">
          {favoriteFoods.map((food) => food && <FoodListItem key={food.id} food={food} meal={mealParam ?? undefined} />)}
        </TabsContent>
      </Tabs>

      <Sheet open={scanOpen} onOpenChange={setScanOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Scan barcode</SheetTitle>
          </SheetHeader>
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border">
            <p className="max-w-[220px] text-center text-sm text-muted">
              Camera preview is mocked for this portfolio build. Search Juhayna or Edita instead.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
