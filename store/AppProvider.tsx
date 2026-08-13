import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { FOOD_BY_ID, FOODS } from '@/data/foods';
import { defaultMealForNow, todayISO } from '@/lib/dates';
import { createId } from '@/lib/format';
import { DEFAULT_PROFILE, scaleMacros, sumEntries } from '@/lib/nutrition';
import type { DayLog, DiaryEntry, FoodItem, Macros, MealType, Profile } from '@/types';

const STORAGE_KEY = 'nourish:v1';

type PersistedState = {
  profile: Profile;
  days: Record<string, DayLog>;
  customFoods: FoodItem[];
  recentFoodIds: string[];
};

type State = PersistedState & {
  hydrated: boolean;
  selectedDate: string;
  selectedMeal: MealType;
};

type Action =
  | { type: 'HYDRATE'; payload: PersistedState | null }
  | { type: 'SET_DATE'; date: string }
  | { type: 'SET_MEAL'; meal: MealType }
  | { type: 'ADD_ENTRY'; entry: DiaryEntry }
  | { type: 'REMOVE_ENTRY'; date: string; entryId: string }
  | { type: 'SET_WATER'; date: string; glasses: number }
  | { type: 'UPDATE_PROFILE'; profile: Partial<Profile> }
  | { type: 'ADD_CUSTOM_FOOD'; food: FoodItem };

const emptyDay = (date: string): DayLog => ({ date, entries: [], waterGlasses: 0 });

const initialState: State = {
  hydrated: false,
  selectedDate: todayISO(),
  selectedMeal: defaultMealForNow(),
  profile: DEFAULT_PROFILE,
  days: {},
  customFoods: [],
  recentFoodIds: [],
};

function ensureDay(days: Record<string, DayLog>, date: string): DayLog {
  return days[date] ?? emptyDay(date);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE': {
      if (!action.payload) {
        return { ...state, hydrated: true, selectedDate: todayISO() };
      }
      return {
        ...state,
        hydrated: true,
        selectedDate: todayISO(),
        selectedMeal: defaultMealForNow(),
        profile: { ...DEFAULT_PROFILE, ...action.payload.profile },
        days: action.payload.days ?? {},
        customFoods: action.payload.customFoods ?? [],
        recentFoodIds: action.payload.recentFoodIds ?? [],
      };
    }
    case 'SET_DATE':
      return { ...state, selectedDate: action.date };
    case 'SET_MEAL':
      return { ...state, selectedMeal: action.meal };
    case 'ADD_ENTRY': {
      const date = state.selectedDate;
      const day = ensureDay(state.days, date);
      const recentFoodIds = [action.entry.foodId, ...state.recentFoodIds.filter((id) => id !== action.entry.foodId)].slice(
        0,
        12,
      );
      return {
        ...state,
        recentFoodIds,
        days: {
          ...state.days,
          [date]: { ...day, entries: [...day.entries, action.entry] },
        },
      };
    }
    case 'REMOVE_ENTRY': {
      const day = ensureDay(state.days, action.date);
      return {
        ...state,
        days: {
          ...state.days,
          [action.date]: {
            ...day,
            entries: day.entries.filter((entry) => entry.id !== action.entryId),
          },
        },
      };
    }
    case 'SET_WATER': {
      const day = ensureDay(state.days, action.date);
      return {
        ...state,
        days: {
          ...state.days,
          [action.date]: { ...day, waterGlasses: action.glasses },
        },
      };
    }
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.profile } };
    case 'ADD_CUSTOM_FOOD':
      return { ...state, customFoods: [action.food, ...state.customFoods] };
    default:
      return state;
  }
}

type AppContextValue = {
  hydrated: boolean;
  selectedDate: string;
  selectedMeal: MealType;
  profile: Profile;
  days: Record<string, DayLog>;
  customFoods: FoodItem[];
  recentFoodIds: string[];
  day: DayLog;
  totals: Macros;
  remaining: number;
  allFoods: FoodItem[];
  setDate: (date: string) => void;
  setMeal: (meal: MealType) => void;
  addFood: (food: FoodItem, servings: number, meal?: MealType) => void;
  removeEntry: (entryId: string) => void;
  setWater: (glasses: number) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  addCustomFood: (food: Omit<FoodItem, 'id' | 'category'>) => FoodItem;
  getFood: (id: string) => FoodItem | undefined;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as PersistedState) : null;
        if (!cancelled) dispatch({ type: 'HYDRATE', payload: parsed });
      } catch {
        if (!cancelled) dispatch({ type: 'HYDRATE', payload: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const persisted: PersistedState = {
      profile: state.profile,
      days: state.days,
      customFoods: state.customFoods,
      recentFoodIds: state.recentFoodIds,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persisted)).catch(() => {});
  }, [state.hydrated, state.profile, state.days, state.customFoods, state.recentFoodIds]);

  const day = state.days[state.selectedDate] ?? emptyDay(state.selectedDate);
  const totals = useMemo(() => sumEntries(day.entries), [day.entries]);
  const remaining = state.profile.calorieGoal - totals.calories;
  const allFoods = useMemo(() => [...state.customFoods, ...FOODS], [state.customFoods]);

  const setDate = useCallback((date: string) => dispatch({ type: 'SET_DATE', date }), []);
  const setMeal = useCallback((meal: MealType) => dispatch({ type: 'SET_MEAL', meal }), []);

  const addFood = useCallback(
    (food: FoodItem, servings: number, meal?: MealType) => {
      const macros = scaleMacros(food, servings);
      dispatch({
        type: 'ADD_ENTRY',
        entry: {
          id: createId('entry'),
          foodId: food.id,
          name: food.name,
          meal: meal ?? state.selectedMeal,
          servings,
          servingLabel: food.servingLabel,
          ...macros,
        },
      });
    },
    [state.selectedMeal],
  );

  const removeEntry = useCallback(
    (entryId: string) => dispatch({ type: 'REMOVE_ENTRY', date: state.selectedDate, entryId }),
    [state.selectedDate],
  );

  const setWater = useCallback(
    (glasses: number) => dispatch({ type: 'SET_WATER', date: state.selectedDate, glasses }),
    [state.selectedDate],
  );

  const updateProfile = useCallback((profile: Partial<Profile>) => {
    dispatch({ type: 'UPDATE_PROFILE', profile });
  }, []);

  const addCustomFood = useCallback((food: Omit<FoodItem, 'id' | 'category'>) => {
    const created: FoodItem = { ...food, id: createId('food'), category: 'custom' };
    dispatch({ type: 'ADD_CUSTOM_FOOD', food: created });
    return created;
  }, []);

  const getFood = useCallback(
    (id: string) => state.customFoods.find((food) => food.id === id) ?? FOOD_BY_ID[id],
    [state.customFoods],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      hydrated: state.hydrated,
      selectedDate: state.selectedDate,
      selectedMeal: state.selectedMeal,
      profile: state.profile,
      days: state.days,
      customFoods: state.customFoods,
      recentFoodIds: state.recentFoodIds,
      day,
      totals,
      remaining,
      allFoods,
      setDate,
      setMeal,
      addFood,
      removeEntry,
      setWater,
      updateProfile,
      addCustomFood,
      getFood,
    }),
    [
      state.hydrated,
      state.selectedDate,
      state.selectedMeal,
      state.profile,
      state.days,
      state.customFoods,
      state.recentFoodIds,
      day,
      totals,
      remaining,
      allFoods,
      setDate,
      setMeal,
      addFood,
      removeEntry,
      setWater,
      updateProfile,
      addCustomFood,
      getFood,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
