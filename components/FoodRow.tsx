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
          {formatKcal(food.calories)} kcal · {food.servingLabel} · P {formatGrams(food.protein)} · C{' '}
          {formatGrams(food.carbs)} · F {formatGrams(food.fat)}
        </Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
});
