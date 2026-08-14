import type { Activity, Goal, Sex } from "@/lib/calculations";

export type FoodUnit = "plate" | "loaf" | "ladle" | "piece";
export type FoodCategory = "local" | "packaged";

export type RestaurantItem = {
  id: string;
  restaurantName: string;
  itemName: string;
  itemNameArabic?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: "restaurant";
};
export type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export type Food = {
  id: string;
  name: string;
  nameArabic: string;
  caloriesPerUnit: number;
  unit: FoodUnit;
  gramsPerUnit: number;
  protein: number;
  carbs: number;
  fat: number;
  category: FoodCategory;
};

export type User = {
  name: string;
  goal: Goal;
  age: number;
  weightKg: number;
  heightCm: number;
  sex: Sex;
  activity: Activity;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  units: "metric" | "imperial";
};

export type LogEntry = {
  id: string;
  foodId: string;
  name: string;
  nameArabic: string;
  meal: MealType;
  servings: number;
  unitLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export const mockFoods: Food[] = [
  { id: "koshari", name: "Koshari", nameArabic: "كشري", caloriesPerUnit: 550, unit: "plate", gramsPerUnit: 400, protein: 12, carbs: 90, fat: 14, category: "local" },
  { id: "ful-medames", name: "Ful medames", nameArabic: "فول مدمس", caloriesPerUnit: 320, unit: "plate", gramsPerUnit: 250, protein: 16, carbs: 40, fat: 10, category: "local" },
  { id: "taameya", name: "Taameya", nameArabic: "طعمية", caloriesPerUnit: 85, unit: "piece", gramsPerUnit: 35, protein: 3, carbs: 6, fat: 5, category: "local" },
  { id: "molokhia", name: "Molokhia", nameArabic: "ملوخية", caloriesPerUnit: 95, unit: "ladle", gramsPerUnit: 180, protein: 4, carbs: 6, fat: 6, category: "local" },
  { id: "mahshi", name: "Mahshi", nameArabic: "محشي", caloriesPerUnit: 420, unit: "plate", gramsPerUnit: 320, protein: 10, carbs: 50, fat: 18, category: "local" },
  { id: "feteer", name: "Feteer", nameArabic: "فطير", caloriesPerUnit: 380, unit: "piece", gramsPerUnit: 140, protein: 8, carbs: 45, fat: 18, category: "local" },
  { id: "shawarma", name: "Shawarma", nameArabic: "شاورما", caloriesPerUnit: 520, unit: "plate", gramsPerUnit: 300, protein: 28, carbs: 40, fat: 26, category: "local" },
  { id: "kofta", name: "Kofta", nameArabic: "كفتة", caloriesPerUnit: 480, unit: "plate", gramsPerUnit: 250, protein: 32, carbs: 12, fat: 34, category: "local" },
  { id: "baladi-bread", name: "Baladi bread", nameArabic: "عيش بلدي", caloriesPerUnit: 160, unit: "loaf", gramsPerUnit: 80, protein: 5, carbs: 32, fat: 1, category: "local" },
  { id: "hawawshi", name: "Hawawshi", nameArabic: "حواوشي", caloriesPerUnit: 450, unit: "piece", gramsPerUnit: 180, protein: 22, carbs: 35, fat: 24, category: "local" },
  { id: "koshari-small", name: "Koshari, small", nameArabic: "كشري صغير", caloriesPerUnit: 350, unit: "plate", gramsPerUnit: 260, protein: 8, carbs: 60, fat: 9, category: "local" },
  { id: "basbousa", name: "Basbousa", nameArabic: "بسبوسة", caloriesPerUnit: 220, unit: "piece", gramsPerUnit: 80, protein: 3, carbs: 36, fat: 8, category: "local" },
  { id: "konafa", name: "Konafa", nameArabic: "كنافة", caloriesPerUnit: 310, unit: "piece", gramsPerUnit: 100, protein: 5, carbs: 40, fat: 14, category: "local" },
  { id: "white-rice", name: "White rice", nameArabic: "أرز أبيض", caloriesPerUnit: 250, unit: "plate", gramsPerUnit: 180, protein: 5, carbs: 53, fat: 2, category: "local" },
  { id: "grilled-chicken", name: "Grilled chicken", nameArabic: "فراخ مشوية", caloriesPerUnit: 390, unit: "plate", gramsPerUnit: 200, protein: 42, carbs: 2, fat: 22, category: "local" },
  { id: "juhayna-yogurt", name: "Juhayna yogurt", nameArabic: "زبادي جهينة", caloriesPerUnit: 140, unit: "piece", gramsPerUnit: 170, protein: 5, carbs: 18, fat: 5, category: "packaged" },
  { id: "edita-molto", name: "Edita Molto cake", nameArabic: "مولتو إيديتا", caloriesPerUnit: 280, unit: "piece", gramsPerUnit: 50, protein: 3, carbs: 32, fat: 16, category: "packaged" },
  { id: "juhayna-mango", name: "Juhayna mango", nameArabic: "مانجو جهينة", caloriesPerUnit: 180, unit: "piece", gramsPerUnit: 235, protein: 1, carbs: 42, fat: 0, category: "packaged" },
];

export const mockUser: User = {
  name: "Layla",
  goal: "lose",
  age: 27,
  weightKg: 68,
  heightCm: 164,
  sex: "female",
  activity: "moderate",
  calorieGoal: 1700,
  proteinGoal: 122,
  carbsGoal: 168,
  fatGoal: 54,
  units: "metric",
};

export const mockDailyLog: LogEntry[] = [
  { id: "e1", foodId: "ful-medames", name: "Ful medames", nameArabic: "فول مدمس", meal: "breakfast", servings: 1, unitLabel: "1 plate", calories: 320, protein: 16, carbs: 40, fat: 10 },
  { id: "e2", foodId: "baladi-bread", name: "Baladi bread", nameArabic: "عيش بلدي", meal: "breakfast", servings: 1, unitLabel: "1 loaf", calories: 160, protein: 5, carbs: 32, fat: 1 },
  { id: "e3", foodId: "juhayna-yogurt", name: "Juhayna yogurt", nameArabic: "زبادي جهينة", meal: "breakfast", servings: 1, unitLabel: "1 piece", calories: 140, protein: 5, carbs: 18, fat: 5 },
  { id: "e4", foodId: "koshari", name: "Koshari", nameArabic: "كشري", meal: "lunch", servings: 1, unitLabel: "1 plate", calories: 550, protein: 12, carbs: 90, fat: 14 },
  { id: "e5", foodId: "taameya", name: "Taameya", nameArabic: "طعمية", meal: "lunch", servings: 3, unitLabel: "3 pieces", calories: 255, protein: 9, carbs: 18, fat: 15 },
  { id: "e6", foodId: "molokhia", name: "Molokhia", nameArabic: "ملوخية", meal: "dinner", servings: 2, unitLabel: "2 ladles", calories: 190, protein: 8, carbs: 12, fat: 12 },
  { id: "e7", foodId: "white-rice", name: "White rice", nameArabic: "أرز أبيض", meal: "dinner", servings: 1, unitLabel: "1 plate", calories: 250, protein: 5, carbs: 53, fat: 2 },
  { id: "e8", foodId: "edita-molto", name: "Edita Molto cake", nameArabic: "مولتو إيديتا", meal: "snacks", servings: 1, unitLabel: "1 piece", calories: 280, protein: 3, carbs: 32, fat: 16 },
];

export const mockRecents = ["koshari", "ful-medames", "taameya", "juhayna-yogurt", "edita-molto"];
export const mockFavorites = ["koshari", "shawarma", "molokhia", "baladi-bread"];

export const mockRestaurants: RestaurantItem[] = [
  { id: "ies-shawarma", restaurantName: "Ibn El Sham", itemName: "Chicken shawarma sandwich", itemNameArabic: "ساندوتش شاورما فراخ", calories: 620, protein: 32, carbs: 48, fat: 28, category: "restaurant" },
  { id: "ies-grill", restaurantName: "Ibn El Sham", itemName: "Mixed grill plate", itemNameArabic: "طبق مشاوي مشكلة", calories: 890, protein: 52, carbs: 22, fat: 62, category: "restaurant" },
  { id: "ies-hummus", restaurantName: "Ibn El Sham", itemName: "Hummus with meat", itemNameArabic: "حمص باللحمة", calories: 480, protein: 22, carbs: 28, fat: 28, category: "restaurant" },
  { id: "ies-fattoush", restaurantName: "Ibn El Sham", itemName: "Fattoush", itemNameArabic: "فتوش", calories: 220, protein: 4, carbs: 24, fat: 12, category: "restaurant" },
  { id: "lychee-cashew", restaurantName: "Lychee", itemName: "Chicken with cashew", itemNameArabic: "فراخ بالكاجو", calories: 710, protein: 38, carbs: 42, fat: 36, category: "restaurant" },
  { id: "lychee-broccoli", restaurantName: "Lychee", itemName: "Beef broccoli", itemNameArabic: "لحم بالبروكلي", calories: 580, protein: 34, carbs: 28, fat: 32, category: "restaurant" },
  { id: "lychee-rice", restaurantName: "Lychee", itemName: "Vegetable fried rice", itemNameArabic: "رز مقلي", calories: 520, protein: 10, carbs: 78, fat: 16, category: "restaurant" },
  { id: "lychee-rolls", restaurantName: "Lychee", itemName: "Spring rolls", itemNameArabic: "سبرنج رولز", calories: 340, protein: 8, carbs: 36, fat: 18, category: "restaurant" },
  { id: "cd-mix", restaurantName: "Cook Door", itemName: "Mix grill", itemNameArabic: "ميكس جريل", calories: 820, protein: 48, carbs: 18, fat: 58, category: "restaurant" },
  { id: "cd-pane", restaurantName: "Cook Door", itemName: "Chicken pane", itemNameArabic: "فراخ بانيه", calories: 640, protein: 36, carbs: 40, fat: 32, category: "restaurant" },
  { id: "cd-molokhia", restaurantName: "Cook Door", itemName: "Molokhia with rice", itemNameArabic: "ملوخية بأرز", calories: 430, protein: 22, carbs: 48, fat: 14, category: "restaurant" },
  { id: "cd-kofta", restaurantName: "Cook Door", itemName: "Kofta sandwich", itemNameArabic: "ساندوتش كفتة", calories: 560, protein: 28, carbs: 42, fat: 26, category: "restaurant" },
];

export const mockWeightTrend = [
  { date: "Jun 26", kg: 70.4 },
  { date: "Jul 3", kg: 70.0 },
  { date: "Jul 10", kg: 69.6 },
  { date: "Jul 17", kg: 69.2 },
  { date: "Jul 24", kg: 68.8 },
  { date: "Jul 31", kg: 68.5 },
  { date: "Aug 7", kg: 68.2 },
  { date: "Aug 14", kg: 68.0 },
];

export const mockWeeklyCalories = [
  { day: "Fri", kcal: 1680 },
  { day: "Sat", kcal: 1920 },
  { day: "Sun", kcal: 1750 },
  { day: "Mon", kcal: 1640 },
  { day: "Tue", kcal: 1710 },
  { day: "Wed", kcal: 1580 },
  { day: "Thu", kcal: 2145 },
];

export const unitLabel: Record<FoodUnit, string> = {
  plate: "plate",
  loaf: "loaf",
  ladle: "ladle",
  piece: "piece",
};

export const activityOptions: { id: Activity; label: string }[] = [
  { id: "sedentary", label: "Mostly sitting" },
  { id: "light", label: "Light walks" },
  { id: "moderate", label: "3–4 workouts / week" },
  { id: "active", label: "Daily training" },
  { id: "very_active", label: "Athlete" },
];
