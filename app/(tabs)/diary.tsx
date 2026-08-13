import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalendarMonth } from '@/components/CalendarMonth';
import { useTheme } from '@/components/useTheme';
import { formatFullDate, startOfMonth, todayISO } from '@/lib/dates';
import { formatGrams, formatKcal } from '@/lib/format';
import { calorieStatus, sumEntries } from '@/lib/nutrition';
import { statusColor } from '@/lib/statusColor';
import { useApp } from '@/store/AppProvider';

export default function DiaryScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { selectedDate, setDate, days, profile } = useApp();
  const [monthDate, setMonthDate] = useState(startOfMonth(selectedDate));

  useEffect(() => {
    setMonthDate(startOfMonth(selectedDate));
  }, [selectedDate]);

  const monthCells = useMemo(() => {
    return Object.values(days).filter((day) => day.date.startsWith(monthDate.slice(0, 7)) && day.entries.length > 0);
  }, [days, monthDate]);

  const monthCalories = monthCells.reduce((sum, day) => sum + sumEntries(day.entries).calories, 0);
  const monthAvg = monthCells.length ? Math.round(monthCalories / monthCells.length) : 0;
  const selectedEntries = days[selectedDate]?.entries ?? [];
  const selectedTotals = sumEntries(selectedEntries);
  const selectedStatus = calorieStatus(selectedTotals.calories, profile.calorieGoal);

  const history = Object.keys(days)
    .sort((a, b) => (a < b ? 1 : -1))
    .filter((date) => (days[date]?.entries.length ?? 0) > 0)
    .slice(0, 21);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Calendar</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>Calories by day</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CalendarMonth
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

        <View style={styles.stats}>
          <StatTile
            label="Month avg"
            value={formatKcal(monthAvg)}
            colors={colors}
          />
          <StatTile
            label="Days logged"
            value={`${monthCells.length}`}
            colors={colors}
          />
          <StatTile
            label="Goal"
            value={formatKcal(profile.calorieGoal)}
            colors={colors}
          />
        </View>

        <Pressable
          onPress={() => router.push('/')}
          style={[styles.selectedCard, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}>
          <View>
            <Text style={[styles.selectedLabel, { color: colors.muted }]}>
              {selectedDate === todayISO() ? 'Today' : formatFullDate(selectedDate)}
            </Text>
            <Text style={[styles.selectedMeta, { color: colors.muted }]}>
              {selectedEntries.length} foods · C {formatGrams(selectedTotals.carbs)} · F{' '}
              {formatGrams(selectedTotals.fat)} · P {formatGrams(selectedTotals.protein)}
            </Text>
          </View>
          <Text style={[styles.selectedKcal, { color: statusColor(selectedStatus, colors) }]}>
            {formatKcal(selectedTotals.calories)}
          </Text>
        </Pressable>

        <Text style={[styles.sectionLabel, { color: colors.muted }]}>History</Text>
        {history.length === 0 ? (
          <View style={[styles.emptyCard, { borderColor: colors.border }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No days logged yet</Text>
            <Text style={[styles.emptyBody, { color: colors.muted }]}>
              Tap a calendar day, then add food. Each date shows that day's calorie total.
            </Text>
          </View>
        ) : (
          <View style={[styles.list, { borderColor: colors.border }]}>
            {history.map((date, index) => {
              const entries = days[date]?.entries ?? [];
              const macros = sumEntries(entries);
              const status = calorieStatus(macros.calories, profile.calorieGoal);
              return (
                <Pressable
                  key={date}
                  onPress={() => {
                    setDate(date);
                    setMonthDate(startOfMonth(date));
                    router.push('/');
                  }}
                  style={[
                    styles.historyRow,
                    index < history.length - 1 && { borderBottomColor: colors.hairline, borderBottomWidth: StyleSheet.hairlineWidth },
                  ]}>
                  <View>
                    <Text style={[styles.historyTitle, { color: colors.text }]}>{formatFullDate(date)}</Text>
                    <Text style={[styles.historyMeta, { color: colors.muted }]}>
                      {entries.length} items · C {Math.round(macros.carbs)} · F {Math.round(macros.fat)} · P{' '}
                      {Math.round(macros.protein)}
                    </Text>
                  </View>
                  <Text style={[styles.historyKcal, { color: statusColor(status, colors) }]}>
                    {formatKcal(macros.calories)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function StatTile({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={[styles.tile, { borderColor: colors.border }]}>
      <Text style={[styles.tileValue, { color: colors.hero }]}>{value}</Text>
      <Text style={[styles.tileLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 36,
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  tile: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tileValue: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  tileLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  selectedCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  selectedMeta: {
    marginTop: 4,
    fontSize: 13,
  },
  selectedKcal: {
    fontSize: 24,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  list: {
    borderRadius: 16,
    borderWidth: 1,
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  historyMeta: {
    fontSize: 12,
    marginTop: 3,
  },
  historyKcal: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
