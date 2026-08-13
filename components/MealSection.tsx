import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/components/useTheme';
import { formatKcal } from '@/lib/format';
import type { DiaryEntry } from '@/types';

const MEAL_META: Record<string, { label: string }> = {
  breakfast: { label: 'Breakfast' },
  lunch: { label: 'Lunch' },
  dinner: { label: 'Dinner' },
  snacks: { label: 'Snacks' },
};

type Props = {
  meal: keyof typeof MEAL_META;
  entries: DiaryEntry[];
  onAdd: () => void;
  onRemove: (entryId: string) => void;
};

export function MealSection({ meal, entries, onAdd, onRemove }: Props) {
  const colors = useTheme();
  const meta = MEAL_META[meal];
  const calories = entries.reduce((sum, entry) => sum + entry.calories, 0);

  return (
    <View style={[styles.card, { borderColor: colors.border }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>{meta.label}</Text>
        <Text style={[styles.headerKcal, { color: colors.text }]}>{formatKcal(calories)}</Text>
      </View>

      {entries.map((entry) => (
        <View key={entry.id} style={[styles.entry, { borderBottomColor: colors.hairline }]}>
          <View style={styles.entryText}>
            <Text style={[styles.entryName, { color: colors.text }]} numberOfLines={1}>
              {entry.name}
            </Text>
            <Text style={[styles.entryMeta, { color: colors.muted }]} numberOfLines={1}>
              {entry.servings === 1 ? entry.servingLabel : `${entry.servings} × ${entry.servingLabel}`}
            </Text>
          </View>
          <Text style={[styles.entryKcal, { color: colors.text }]}>{formatKcal(entry.calories)}</Text>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              onRemove(entry.id);
            }}
            hitSlop={10}
            style={styles.remove}>
            <Ionicons name="close" size={16} color={colors.placeholder} />
          </Pressable>
        </View>
      ))}

      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          onAdd();
        }}
        style={({ pressed }) => [styles.addRow, pressed && { backgroundColor: colors.surfaceMuted }]}>
        <Ionicons name="add-circle" size={22} color={colors.tint} />
        <Text style={[styles.addLabel, { color: colors.tint }]}>Add Food</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  headerKcal: {
    fontSize: 16,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 64,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  entryText: {
    flex: 1,
  },
  entryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  entryMeta: {
    fontSize: 13,
    marginTop: 2,
  },
  entryKcal: {
    fontSize: 16,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  remove: {
    padding: 2,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    height: 52,
  },
  addLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
