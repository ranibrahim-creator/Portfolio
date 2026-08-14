"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Suspense } from "react";

import { PortionSelector } from "@/components/log/PortionSelector";
import { foodById } from "@/lib/store";

export default function FoodDetailPage() {
  return (
    <Suspense>
      <FoodDetail />
    </Suspense>
  );
}

function FoodDetail() {
  const params = useParams<{ foodId: string }>();
  const food = foodById(params.foodId);
  if (!food) notFound();

  return (
    <main className="px-5 pb-8 pt-6">
      <Link href="/log" className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border">
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <p className="text-sm text-muted" dir="rtl">
        {food.nameArabic}
      </p>
      <h1 className="text-2xl font-semibold">{food.name}</h1>
      <p className="mt-1 text-sm text-muted">
        {food.caloriesPerUnit} kcal / {food.unit} · {food.gramsPerUnit}g
      </p>
      <div className="mt-6">
        <PortionSelector food={food} />
      </div>
    </main>
  );
}
