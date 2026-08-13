import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalendarMonth } from '@/components/CalendarMonth';
import { CalorieRing } from '@/components/CalorieRing';
import { MacroRow } from '@/components/MacroRow';
import { MealSection } from '@/components/MealSection';
import { NutritionSummary } from '@/components/NutritionSummary';
import { useTheme } from '@/components/useTheme';
import { WaterTracker } from '@/components/WaterTracker';
import { addDays, formatDayTitle, formatFullDate, startOfMonth } from '@/lib/dates';
import { formatKcal } from '@/lib/format';
import { useApp } from '@/store/AppProvider';
import type { MealType } from '@/types';

const MEALS: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

export default function TodayScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { selectedDate, setDate, setMeal, day, totals, profile, removeEntry, setWater, days } = useApp();
  const [monthDate, setMonthDate] = useState(startOfMonth(selectedDate));

  useEffect(() => {
    setMonthDate(startOfMonth(selectedDate));
  }, [selectedDate]);

  const openLog = (meal: MealType) => {
    setMeal(meal);
    router.push('/log');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => setDate(addDays(selectedDate, -1))} hitSlop={12} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.tint} />
        </Pressable>
        <View style={styles.dateBlock}>
          <Text style={[styles.dayTitle, { color: colors.text }]}>{formatDayTitle(selectedDate)}</Text>
          <Text style={[styles.dateSub, { color: colors.muted }]}>{formatFullDate(selectedDate)}</Text>
        </View>
        <Pressable onPress={() => setDate(addDays(selectedDate, 1))} hitSlop={12} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={22} color={colors.tint} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CalendarMonth
          compact
          selectedDate={selectedDate}
          monthDate={monthDate}
          calorieGoal={profile.calorieGoal}
          days={days}
          onSelectDate={(date) => {
            setDate(date);
            setMonthDate(startOfMonth(date));
          }}
          onChangeMonth={setMonthDate}
        />

        <View style={[styles.hero, { borderColor: colors.border }]}>
          <CalorieRing eaten={totals.calories} goal={profile.calorieGoal} />
          <View style={styles.statRow}>
            <MiniStat label="Goal" value={formatKcal(profile.calorieGoal)} colors={colors} />
            <MiniStat label="Food" value={formatKcal(totals.calories)} colors={colors} />
            <MiniStat label="Exercise" value="0" colors={colors} />
          </View>
          <MacroRow
            protein={totals.protein}
            carbs={totals.carbs}
            fat={totals.fat}
            proteinGoal={profile.proteinGoal}
            carbsGoal={profile.carbsGoal}
            fatGoal={profile.fatGoal}
          />
        </View>

        <View style={[styles.waterCard, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
          <View style={styles.waterHeader}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>Water</Text>
            <Text style={[styles.waterCount, { color: colors.hero }]}>
              {day.waterGlasses} of {profile.waterGoal}
            </Text>
          </View>
          <WaterTracker count={day.waterGlasses} goal={profile.waterGoal} onChange={setWater} />
        </View>

        <Text style={[styles.mealsTitle, { color: colors.text }]}>Today's meals</Text>
        {MEALS.map((meal) => (
          <MealSection
            key={meal}
            meal={meal}
            entries={day.entries.filter((entry) => entry.meal === meal)}
            onAdd={() => openLog(meal)}
            onRemove={removeEntry}
          />
        ))}

        <NutritionSummary goal={profile.calorieGoal} food={totals.calories} />
      </ScrollView>
    </View>
  );
}

function MiniStat({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={styles.miniStat}>
      <Text style={[styles.miniValue, { color: colors.hero }]}>{value}</Text>
      <Text style={[styles.miniLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBlock: {
    flex: 1,
    alignItems: 'center',
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  dateSub: {
    fontSize: 13,
    marginTop: 1,
    fontWeight: '500',
  },
  content: {
    padding: 16,
    paddingTop: 12,
    gap: 14,
    paddingBottom: 36,
  },
  hero: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
  },
  statRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  miniStat: {
    alignItems: 'center',
  },
  miniValue: {
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  miniLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  waterCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  waterCount: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  mealsTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginTop: 4,
  },
});
