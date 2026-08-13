import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/components/useTheme';
import { formatGrams, formatKcal } from '@/lib/format';
import type { FoodItem } from '@/types';

type Props = {
  food: FoodItem;
  right?: ReactNode;
};

export function FoodRow({ food, right }: Props) {
  const colors = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.body}>
        <Text style={[styles.name, { color: colors.text }]}>{food.name}</Text>
        <Text style={[styles.meta, { color: colors.muted }]}>
          {food.servingLabel} · C {formatGrams(food.carbs)}g · F {formatGrams(food.fat)}g · P {formatGrams(food.protein)}g
        </Text>
      </View>
      <Text style={[styles.kcal, { color: colors.text }]}>{formatKcal(food.calories)}</Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    minHeight: 64,
    gap: 12,
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  meta: {
    fontSize: 13,
    marginTop: 2,
  },
  kcal: {
    fontSize: 16,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
