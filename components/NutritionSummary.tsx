import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/components/useTheme';
import { formatKcal } from '@/lib/format';

type Props = {
  goal: number;
  food: number;
};

export function NutritionSummary({ goal, food }: Props) {
  const colors = useTheme();
  const remaining = goal - food;
  const over = remaining < 0;

  const rows = [
    { label: 'Goal', value: goal },
    { label: 'Food', value: food },
    { label: 'Exercise', value: 0 },
  ];

  return (
    <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}>
      <Text style={[styles.title, { color: colors.muted }]}>Calories remaining</Text>
      <View style={styles.math}>
        {rows.map((row, index) => (
          <View key={row.label} style={styles.mathItem}>
            <Text style={[styles.mathValue, { color: colors.hero }]}>{formatKcal(row.value)}</Text>
            <Text style={[styles.mathLabel, { color: colors.muted }]}>{row.label}</Text>
            {index < rows.length - 1 && (
              <Text style={[styles.operator, { color: colors.placeholder }]}>{index === 0 ? '-' : '+'}</Text>
            )}
          </View>
        ))}
        <Text style={[styles.operator, { color: colors.placeholder, marginTop: 2 }]}>=</Text>
        <View style={styles.mathItem}>
          <Text style={[styles.mathValue, { color: over ? colors.over : colors.tint }]}>
            {formatKcal(remaining)}
          </Text>
          <Text style={[styles.mathLabel, { color: colors.muted }]}>Remaining</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  math: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  mathItem: {
    alignItems: 'center',
    minWidth: 52,
  },
  mathValue: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  mathLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  operator: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
});
