import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/components/useTheme';
import { formatGrams } from '@/lib/format';

type Macro = {
  label: string;
  value: number;
  goal: number;
  color: string;
};

type Props = {
  protein: number;
  carbs: number;
  fat: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
};

export function MacroRow({ protein, carbs, fat, proteinGoal, carbsGoal, fatGoal }: Props) {
  const colors = useTheme();
  const macros: Macro[] = [
    { label: 'Protein', value: protein, goal: proteinGoal, color: colors.protein },
    { label: 'Carbs', value: carbs, goal: carbsGoal, color: colors.carbs },
    { label: 'Fat', value: fat, goal: fatGoal, color: colors.fat },
  ];

  return (
    <View style={styles.row}>
      {macros.map((macro) => {
        const ratio = macro.goal <= 0 ? 0 : Math.min(macro.value / macro.goal, 1);
        return (
          <View key={macro.label} style={styles.item}>
            <View style={[styles.track, { backgroundColor: colors.ringTrack }]}>
              <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: macro.color }]} />
            </View>
            <Text style={[styles.label, { color: colors.muted }]}>{macro.label}</Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {formatGrams(macro.value)}
              <Text style={[styles.goal, { color: colors.muted }]}>/{formatGrams(macro.goal)}g</Text>
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  item: {
    flex: 1,
  },
  track: {
    height: 6,
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 8,
  },
  fill: {
    height: '100%',
    borderRadius: 99,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
  },
  goal: {
    fontWeight: '500',
  },
});
