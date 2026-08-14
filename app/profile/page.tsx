"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { type Activity, type Goal, goalsFromStats } from "@/lib/calculations";
import { activityOptions } from "@/lib/mockData";
import { useApp } from "@/lib/store";

export default function ProfilePage() {
  const { user, updateUser } = useApp();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const recalc = (patch: Partial<typeof user>) => {
    const next = { ...user, ...patch };
    const goals = goalsFromStats(next);
    updateUser({ ...patch, calorieGoal: goals.calorieGoal, proteinGoal: goals.protein, carbsGoal: goals.carbs, fatGoal: goals.fat });
  };

  return (
    <main className="px-6 pb-32 pt-6">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="mt-2 text-sm text-muted">{user.name} · Cairo</p>

      <section className="mt-6 space-y-4 rounded-xl border border-border bg-surface p-6">
        <Field label="Goal">
          <Select value={user.goal} onValueChange={(value) => recalc({ goal: value as Goal })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lose">Lose weight</SelectItem>
              <SelectItem value="maintain">Maintain</SelectItem>
              <SelectItem value="gain">Gain weight</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Weight (kg)">
          <Input
            inputMode="decimal"
            defaultValue={user.weightKg}
            onBlur={(event) => recalc({ weightKg: Number(event.target.value) || user.weightKg })}
          />
        </Field>
        <Field label="Activity">
          <Select value={user.activity} onValueChange={(value) => recalc({ activity: value as Activity })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activityOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <p className="text-sm text-muted">
          Daily target <span className="font-semibold tabular-nums text-foreground">{user.calorieGoal.toLocaleString()} kcal</span>
        </p>
      </section>

      <section className="mt-4 space-y-4 rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Imperial units</p>
            <p className="text-sm text-muted">lb and in</p>
          </div>
          <Switch
            checked={user.units === "imperial"}
            onCheckedChange={(checked) => updateUser({ units: checked ? "imperial" : "metric" })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark mode</p>
            <p className="text-sm text-muted">Linear-style night canvas</p>
          </div>
          <Switch
            checked={mounted && theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
      </section>

      <Button asChild variant="outline" className="mt-6 w-full">
        <Link href="/onboarding">Replay onboarding</Link>
      </Button>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
