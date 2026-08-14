"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { FoodListItem } from "@/components/log/FoodListItem";
import { FoodSearchBar } from "@/components/log/FoodSearchBar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockFoods } from "@/lib/mockData";
import { useApp } from "@/lib/store";

export default function LogPage() {
  return (
    <Suspense>
      <LogScreen />
    </Suspense>
  );
}

function LogScreen() {
  const params = useSearchParams();
  const meal = params.get("meal") ?? undefined;
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

  const recentFoods = recents.map((id) => mockFoods.find((food) => food.id === id)).filter(Boolean);
  const favoriteFoods = favorites.map((id) => mockFoods.find((food) => food.id === id)).filter(Boolean);

  return (
    <main className="px-5 pb-8 pt-6">
      <h1 className="text-2xl font-semibold">Log food</h1>
      <FoodSearchBar value={query} onChange={setQuery} onScan={() => setScanOpen(true)} />

      <Tabs defaultValue="local" className="mt-2">
        <TabsList className="w-full">
          <TabsTrigger value="local">Local Dishes</TabsTrigger>
          <TabsTrigger value="recents">Recents</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="local" className="space-y-2">
          {filtered.map((food) => (
            <FoodListItem key={food.id} food={food} meal={meal} />
          ))}
        </TabsContent>
        <TabsContent value="recents" className="space-y-2">
          {recentFoods.map((food) => food && <FoodListItem key={food.id} food={food} meal={meal} />)}
        </TabsContent>
        <TabsContent value="favorites" className="space-y-2">
          {favoriteFoods.map((food) => food && <FoodListItem key={food.id} food={food} meal={meal} />)}
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
