export type Sex = "female" | "male";
export type Activity = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type Goal = "lose" | "maintain" | "gain";

export type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

const ACTIVITY_FACTOR: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function mifflinStJeor(sex: Sex, weightKg: number, heightCm: number, age: number) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(base + (sex === "male" ? 5 : -161));
}

export function tdee(sex: Sex, weightKg: number, heightCm: number, age: number, activity: Activity) {
  return Math.round(mifflinStJeor(sex, weightKg, heightCm, age) * ACTIVITY_FACTOR[activity]);
}

export function calorieTarget(energy: number, goal: Goal) {
  if (goal === "lose") return Math.max(1200, energy - 500);
  if (goal === "gain") return energy + 300;
  return energy;
}

export function macroTargets(calorieGoal: number, weightKg: number) {
  const protein = Math.round(weightKg * 1.8);
  const fat = Math.round(weightKg * 0.8);
  const carbs = Math.max(0, Math.round((calorieGoal - protein * 4 - fat * 9) / 4));
  return { protein, carbs, fat };
}

export function goalsFromStats(input: {
  sex: Sex;
  weightKg: number;
  heightCm: number;
  age: number;
  activity: Activity;
  goal: Goal;
}) {
  const calories = calorieTarget(
    tdee(input.sex, input.weightKg, input.heightCm, input.age, input.activity),
    input.goal,
  );
  return { calorieGoal: calories, ...macroTargets(calories, input.weightKg) };
}

export function scaleMacros(base: Macros, servings: number): Macros {
  return {
    calories: Math.round(base.calories * servings),
    protein: Math.round(base.protein * servings * 10) / 10,
    carbs: Math.round(base.carbs * servings * 10) / 10,
    fat: Math.round(base.fat * servings * 10) / 10,
  };
}
