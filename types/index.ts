export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export type FoodCategory =
  | 'protein'
  | 'dairy'
  | 'grains'
  | 'fruit'
  | 'veg'
  | 'snacks'
  | 'drinks'
  | 'meals'
  | 'custom';

export type Sex = 'female' | 'male';
export type Activity = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose' | 'maintain' | 'gain';

export type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type FoodItem = {
  id: string;
  name: string;
  brand?: string;
  servingLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: FoodCategory;
};

export type DiaryEntry = {
  id: string;
  foodId: string;
  name: string;
  meal: MealType;
  servings: number;
  servingLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type DayLog = {
  date: string;
  entries: DiaryEntry[];
  waterGlasses: number;
};

export type Profile = {
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: Activity;
  goal: Goal;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  waterGoal: number;
};
