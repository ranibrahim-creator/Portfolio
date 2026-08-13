import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '@/components/Chip';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Stepper } from '@/components/Stepper';
import { useTheme } from '@/components/useTheme';
import { formatGrams, formatKcal } from '@/lib/format';
import { scaleMacros } from '@/lib/nutrition';
import { useApp } from '@/store/AppProvider';
import type { MealType } from '@/types';

const MEALS: { id: MealType; label: string }[] = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snacks', label: 'Snacks' },
];

export default function LogFoodScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ foodId?: string; meal?: MealType }>();
  const { getFood, addFood, selectedMeal, setMeal } = useApp();
  const [servings, setServings] = useState(1);
  const [meal, setLocalMeal] = useState<MealType>((params.meal as MealType | undefined) ?? selectedMeal);

  const food = params.foodId ? getFood(params.foodId) : undefined;
  const macros = useMemo(() => (food ? scaleMacros(food, servings) : null), [food, servings]);

  if (!food || !macros) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <Text style={[styles.missing, { color: colors.muted }]}>Food not found.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.close}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.kicker, { color: colors.muted }]}>Add to diary</Text>
        <View style={styles.close} />
      </View>

      <View style={styles.body}>
        <Text style={[styles.name, { color: colors.text }]}>{food.name}</Text>
        <Text style={[styles.serving, { color: colors.muted }]}>{food.servingLabel}</Text>

        <View style={[styles.macroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MacroStat label="Calories" value={formatKcal(macros.calories)} colors={colors} />
          <MacroStat label="Protein" value={`${formatGrams(macros.protein)}g`} colors={colors} />
          <MacroStat label="Carbs" value={`${formatGrams(macros.carbs)}g`} colors={colors} />
          <MacroStat label="Fat" value={`${formatGrams(macros.fat)}g`} colors={colors} />
        </View>

        <Text style={[styles.label, { color: colors.muted }]}>Servings</Text>
        <Stepper value={servings} onChange={setServings} />

        <Text style={[styles.label, { color: colors.muted }]}>Meal</Text>
        <View style={styles.chips}>
          {MEALS.map((item) => (
            <Chip
              key={item.id}
              label={item.label}
              selected={meal === item.id}
              onPress={() => {
                setLocalMeal(item.id);
                setMeal(item.id);
              }}
            />
          ))}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton
          label={`Add ${formatKcal(macros.calories)} kcal`}
          onPress={() => {
            addFood(food, servings, meal);
            router.replace('/');
          }}
        />
      </View>
    </View>
  );
}

function MacroStat({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  close: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  body: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  name: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  serving: {
    fontSize: 15,
    marginTop: -4,
  },
  macroCard: {
    marginTop: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 16,
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footer: {
    paddingHorizontal: 20,
  },
  missing: {
    padding: 24,
    fontSize: 16,
  },
});
