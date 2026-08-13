import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalorieRing } from '@/components/CalorieRing';
import { MacroRow } from '@/components/MacroRow';
import { MealSection } from '@/components/MealSection';
import { useTheme } from '@/components/useTheme';
import { WaterTracker } from '@/components/WaterTracker';
import { addDays, formatDayTitle, formatFullDate, isToday } from '@/lib/dates';
import { formatKcal } from '@/lib/format';
import { useApp } from '@/store/AppProvider';
import type { MealType } from '@/types';

const MEALS: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

export default function TodayScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { selectedDate, setDate, setMeal, day, totals, profile, removeEntry, setWater } = useApp();

  const openLog = (meal: MealType) => {
    setMeal(meal);
    router.push('/log');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => setDate(addDays(selectedDate, -1))} hitSlop={12} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.dateBlock}>
          <Text style={[styles.dayTitle, { color: colors.text }]}>{formatDayTitle(selectedDate)}</Text>
          <Text style={[styles.dateSub, { color: colors.muted }]}>{formatFullDate(selectedDate)}</Text>
        </View>
        <Pressable
          onPress={() => setDate(addDays(selectedDate, 1))}
          hitSlop={12}
          style={[styles.navBtn, isToday(selectedDate) && { opacity: 0.28 }]}
          disabled={isToday(selectedDate)}>
          <Ionicons name="chevron-forward" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.surface, colors.tintSoft]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { borderColor: colors.border }]}>
          <CalorieRing eaten={totals.calories} goal={profile.calorieGoal} />
          <Text style={[styles.heroMeta, { color: colors.muted }]}>
            {formatKcal(totals.calories)} eaten · {formatKcal(profile.calorieGoal)} goal
          </Text>
          <MacroRow
            protein={totals.protein}
            carbs={totals.carbs}
            fat={totals.fat}
            proteinGoal={profile.proteinGoal}
            carbsGoal={profile.carbsGoal}
            fatGoal={profile.fatGoal}
          />
        </LinearGradient>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.waterHeader}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>Water</Text>
            <Text style={[styles.waterCount, { color: colors.text }]}>
              {day.waterGlasses}/{profile.waterGoal}
            </Text>
          </View>
          <WaterTracker count={day.waterGlasses} goal={profile.waterGoal} onChange={setWater} />
        </View>

        {MEALS.map((meal) => (
          <MealSection
            key={meal}
            meal={meal}
            entries={day.entries.filter((entry) => entry.meal === meal)}
            onAdd={() => openLog(meal)}
            onRemove={removeEntry}
          />
        ))}

        <View style={{ height: 8 }} />
      </ScrollView>
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
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    paddingTop: 8,
    gap: 14,
    paddingBottom: 32,
  },
  hero: {
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    gap: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  heroMeta: {
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  waterCount: {
    fontSize: 14,
    fontWeight: '700',
  },
});
