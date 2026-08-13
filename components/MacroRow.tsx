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
    { label: 'Carbs', value: carbs, goal: carbsGoal, color: colors.carbs },
    { label: 'Fat', value: fat, goal: fatGoal, color: colors.fat },
    { label: 'Protein', value: protein, goal: proteinGoal, color: colors.protein },
  ];

  return (
    <View style={styles.row}>
      {macros.map((macro) => {
        const ratio = macro.goal <= 0 ? 0 : Math.min(macro.value / macro.goal, 1);
        return (
          <View key={macro.label} style={styles.item}>
            <Text style={[styles.value, { color: colors.hero }]}>
              {formatGrams(macro.value)}
              <Text style={[styles.goal, { color: colors.muted }]}>/{formatGrams(macro.goal)}g</Text>
            </Text>
            <View style={[styles.track, { backgroundColor: colors.ringTrack }]}>
              <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: macro.color }]} />
            </View>
            <Text style={[styles.label, { color: colors.muted }]}>{macro.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  item: {
    flex: 1,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginBottom: 6,
  },
  goal: {
    fontWeight: '500',
    fontSize: 12,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
