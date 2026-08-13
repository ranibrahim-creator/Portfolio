import type { Activity, DiaryEntry, Goal, Macros, Profile, Sex } from '../types';

const ACTIVITY_FACTOR: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function mifflinStJeor(sex: Sex, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(base + (sex === 'male' ? 5 : -161));
}

export function tdee(sex: Sex, weightKg: number, heightCm: number, age: number, activity: Activity): number {
  return Math.round(mifflinStJeor(sex, weightKg, heightCm, age) * ACTIVITY_FACTOR[activity]);
}

export function calorieTarget(energy: number, goal: Goal): number {
  if (goal === 'lose') return Math.max(1200, energy - 500);
  if (goal === 'gain') return energy + 300;
  return energy;
}

export function macroTargets(calorieGoal: number, weightKg: number): Pick<Macros, 'protein' | 'carbs' | 'fat'> {
  const protein = Math.round(weightKg * 1.8);
  const fat = Math.round(weightKg * 0.8);
  const carbs = Math.max(0, Math.round((calorieGoal - protein * 4 - fat * 9) / 4));
  return { protein, carbs, fat };
}

export function goalsFromProfile(input: Pick<Profile, 'sex' | 'weightKg' | 'heightCm' | 'age' | 'activity' | 'goal'>): {
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
} {
  const calories = calorieTarget(
    tdee(input.sex, input.weightKg, input.heightCm, input.age, input.activity),
    input.goal,
  );
  const macros = macroTargets(calories, input.weightKg);
  return {
    calorieGoal: calories,
    proteinGoal: macros.protein,
    carbsGoal: macros.carbs,
    fatGoal: macros.fat,
  };
}

export function scaleMacros(base: Macros, servings: number): Macros {
  return {
    calories: Math.round(base.calories * servings),
    protein: round1(base.protein * servings),
    carbs: round1(base.carbs * servings),
    fat: round1(base.fat * servings),
  };
}

export function sumEntries(entries: DiaryEntry[]): Macros {
  return entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

export const DEFAULT_PROFILE: Profile = {
  name: '',
  sex: 'female',
  age: 28,
  heightCm: 165,
  weightKg: 65,
  activity: 'moderate',
  goal: 'lose',
  calorieGoal: 1800,
  proteinGoal: 117,
  carbsGoal: 178,
  fatGoal: 52,
  waterGoal: 8,
};
