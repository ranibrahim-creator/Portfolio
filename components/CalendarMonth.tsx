import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/components/useTheme';
import { WEEKDAYS_SUN, addMonths, formatMonthYear, isToday, monthGrid } from '@/lib/dates';
import { formatKcal } from '@/lib/format';
import { calorieStatus, sumEntries } from '@/lib/nutrition';
import { statusColor } from '@/lib/statusColor';
import type { DayLog } from '@/types';

type Props = {
  selectedDate: string;
  monthDate: string;
  calorieGoal: number;
  days: Record<string, DayLog>;
  onSelectDate: (date: string) => void;
  onChangeMonth: (date: string) => void;
  compact?: boolean;
};

export function CalendarMonth({
  selectedDate,
  monthDate,
  calorieGoal,
  days,
  onSelectDate,
  onChangeMonth,
  compact = false,
}: Props) {
  const colors = useTheme();
  const cells = monthGrid(monthDate);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.monthNav}>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            onChangeMonth(addMonths(monthDate, -1));
          }}
          hitSlop={10}
          style={styles.navBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.tint} />
        </Pressable>
        <Text style={[styles.monthTitle, { color: colors.text }]}>{formatMonthYear(monthDate)}</Text>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            onChangeMonth(addMonths(monthDate, 1));
          }}
          hitSlop={10}
          style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={20} color={colors.tint} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS_SUN.map((label, index) => (
          <Text key={`${label}-${index}`} style={[styles.weekLabel, { color: colors.placeholder }]}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((date, index) => {
          if (!date) {
            return <View key={`empty-${index}`} style={[styles.cell, compact && styles.cellCompact]} />;
          }
          const entries = days[date]?.entries ?? [];
          const calories = sumEntries(entries).calories;
          const logged = entries.length > 0;
          const selected = date === selectedDate;
          const today = isToday(date);
          const status = calorieStatus(calories, calorieGoal);
          const kcalColor = logged ? statusColor(status, colors) : colors.placeholder;

          return (
            <Pressable
              key={date}
              onPress={() => {
                Haptics.selectionAsync();
                onSelectDate(date);
              }}
              style={[
                styles.cell,
                compact && styles.cellCompact,
                selected && { backgroundColor: colors.tintSoft, borderColor: colors.tint, borderWidth: 1.5 },
                today && !selected && { borderColor: colors.tint, borderWidth: 1 },
              ]}>
              <Text
                style={[
                  styles.dayNum,
                  { color: selected ? colors.tint : today ? colors.tint : colors.text },
                  compact && styles.dayNumCompact,
                ]}>
                {Number(date.slice(-2))}
              </Text>
              <Text
                style={[
                  styles.kcal,
                  compact && styles.kcalCompact,
                  { color: kcalColor },
                ]}>
                {logged ? formatKcal(calories) : '—'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.legend}>
        <LegendDot color={colors.under} label="Under" />
        <LegendDot color={colors.tint} label="On track" />
        <LegendDot color={colors.near} label="Close" />
        <LegendDot color={colors.over} label="Over" />
      </View>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  const colors = useTheme();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.legendLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.285%',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 4,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  cellCompact: {
    minHeight: 44,
    paddingVertical: 2,
  },
  dayNum: {
    fontSize: 14,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  dayNumCompact: {
    fontSize: 13,
  },
  kcal: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  kcalCompact: {
    fontSize: 9,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
});
