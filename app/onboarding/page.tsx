"use client";

import { motion, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { Bell, Dumbbell, Leaf, Scale, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { GoalCard } from "@/components/onboarding/GoalCard";
import { ProgressDots } from "@/components/onboarding/ProgressDots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Activity, type Goal, type Sex, goalsFromStats } from "@/lib/calculations";
import { activityOptions } from "@/lib/mockData";
import { useApp } from "@/lib/store";

type Draft = {
  goal: Goal;
  age: string;
  weightKg: string;
  heightCm: string;
  sex: Sex;
  activity: Activity;
};

export default function OnboardingPage() {
  const router = useRouter();
  const { updateUser } = useApp();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({
    goal: "lose",
    age: "27",
    weightKg: "68",
    heightCm: "164",
    sex: "female",
    activity: "moderate",
  });

  const goals = useMemo(
    () =>
      goalsFromStats({
        goal: draft.goal,
        age: Number(draft.age) || 27,
        weightKg: Number(draft.weightKg) || 68,
        heightCm: Number(draft.heightCm) || 164,
        sex: draft.sex,
        activity: draft.activity,
      }),
    [draft],
  );

  const finish = () => {
    updateUser({
      goal: draft.goal,
      age: Number(draft.age) || 27,
      weightKg: Number(draft.weightKg) || 68,
      heightCm: Number(draft.heightCm) || 164,
      sex: draft.sex,
      activity: draft.activity,
      calorieGoal: goals.calorieGoal,
      proteinGoal: goals.protein,
      carbsGoal: goals.carbs,
      fatGoal: goals.fat,
    });
    router.push("/");
  };

  return (
    <main className="flex min-h-dvh flex-col px-5 pb-8 pt-6">
      {step > 0 && (
        <div className="mb-8">
          <ProgressDots total={4} current={step - 1} />
        </div>
      )}

      {step === 0 && (
        <section className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-white text-black">
              <Leaf className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-semibold">Nourish</h1>
            <p className="mt-3 max-w-[280px] text-base text-muted">
              Track Egyptian meals in plates, ladles, and loaves — not just grams.
            </p>
          </div>
          <Button onClick={() => setStep(1)}>Get Started</Button>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-4">
          <h1 className="text-2xl font-semibold">What&apos;s your goal?</h1>
          <GoalCard
            label="Lose weight"
            description="A gentle calorie deficit"
            icon={Scale}
            selected={draft.goal === "lose"}
            onSelect={() => setDraft({ ...draft, goal: "lose" })}
          />
          <GoalCard
            label="Maintain"
            description="Stay where you are"
            icon={Leaf}
            selected={draft.goal === "maintain"}
            onSelect={() => setDraft({ ...draft, goal: "maintain" })}
          />
          <GoalCard
            label="Gain weight"
            description="Build with a surplus"
            icon={Dumbbell}
            selected={draft.goal === "gain"}
            onSelect={() => setDraft({ ...draft, goal: "gain" })}
          />
          <Button className="mt-4 w-full" onClick={() => setStep(2)}>
            Continue
          </Button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <h1 className="text-2xl font-semibold">A few stats</h1>
          <Field label="Age">
            <Input inputMode="numeric" value={draft.age} onChange={(event) => setDraft({ ...draft, age: event.target.value })} />
          </Field>
          <Field label="Weight (kg)">
            <Input inputMode="decimal" value={draft.weightKg} onChange={(event) => setDraft({ ...draft, weightKg: event.target.value })} />
          </Field>
          <Field label="Height (cm)">
            <Input inputMode="decimal" value={draft.heightCm} onChange={(event) => setDraft({ ...draft, heightCm: event.target.value })} />
          </Field>
          <Field label="Sex">
            <div className="grid grid-cols-2 gap-2">
              {(["female", "male"] as const).map((sex) => (
                <button
                  key={sex}
                  type="button"
                  onClick={() => setDraft({ ...draft, sex })}
                  className={`h-12 rounded-xl border text-sm font-semibold capitalize transition-colors duration-200 ease-out ${
                    draft.sex === sex ? "border-accent bg-surface" : "border-border"
                  }`}
                >
                  {sex}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Activity">
            <Select value={draft.activity} onValueChange={(value) => setDraft({ ...draft, activity: value as Activity })}>
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
          <Button className="w-full" onClick={() => setStep(3)}>
            Calculate my target
          </Button>
        </section>
      )}

      {step === 3 && <Reveal target={goals.calorieGoal} onContinue={() => setStep(4)} />}

      {step === 4 && (
        <section className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-border">
              <Bell className="h-7 w-7 text-accent" />
            </div>
            <h1 className="text-2xl font-semibold">Stay on track</h1>
            <p className="mt-3 max-w-[280px] text-base text-muted">
              We&apos;ll remind you to log meals so koshari doesn&apos;t disappear from the diary.
            </p>
          </div>
          <div className="space-y-3">
            <Button className="w-full" onClick={finish}>
              Allow
            </Button>
            <Button variant="ghost" className="w-full" onClick={finish}>
              Skip
            </Button>
          </div>
        </section>
      )}
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

function Reveal({ target, onContinue }: { target: number; onContinue: () => void }) {
  const spring = useSpring(0, { stiffness: 70, damping: 18, mass: 0.9 });
  const display = useTransform(spring, (value) => Math.round(value).toLocaleString());
  const progress = useTransform(spring, (value) => value / Math.max(target, 1));
  const [label, setLabel] = useState("0");

  useMotionValueEvent(display, "change", setLabel);

  useEffect(() => {
    spring.set(target);
  }, [spring, target]);

  const size = 220;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = useTransform(progress, (value) => circumference * (1 - value));

  return (
    <section className="flex flex-1 flex-col items-center">
      <Sparkles className="mb-4 h-5 w-5 text-accent" />
      <h1 className="text-2xl font-semibold">Your daily target</h1>
      <div className="relative my-10" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-border" />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#FF9F0A"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-4xl font-bold tabular-nums">{label}</p>
          <p className="mt-1 text-sm text-muted">kcal / day</p>
        </div>
      </div>
      <Button className="mt-auto w-full" onClick={onContinue}>
        Looks good
      </Button>
    </section>
  );
}
