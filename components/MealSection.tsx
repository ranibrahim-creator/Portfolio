import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/components/useTheme';
import { formatKcal } from '@/lib/format';
import type { DiaryEntry } from '@/types';

const MEAL_META: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  breakfast: { label: 'Breakfast', icon: 'sunny-outline' },
  lunch: { label: 'Lunch', icon: 'restaurant-outline' },
  dinner: { label: 'Dinner', icon: 'moon-outline' },
  snacks: { label: 'Snacks', icon: 'nutrition-outline' },
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
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconWrap, { backgroundColor: colors.tintSoft }]}>
            <Ionicons name={meta.icon} size={16} color={colors.tint} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{meta.label}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.kcal, { color: colors.muted }]}>{formatKcal(calories)} kcal</Text>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              onAdd();
            }}
            hitSlop={8}
            style={[styles.addBtn, { backgroundColor: colors.tint }]}>
            <Ionicons name="add" size={18} color={colors.inverted} />
          </Pressable>
        </View>
      </View>

      {entries.length === 0 ? (
        <Text style={[styles.empty, { color: colors.muted }]}>Nothing logged yet</Text>
      ) : (
        entries.map((entry, index) => (
          <View
            key={entry.id}
            style={[
              styles.entry,
              index < entries.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
            ]}>
            <View style={styles.entryText}>
              <Text style={[styles.entryName, { color: colors.text }]}>{entry.name}</Text>
              <Text style={[styles.entryMeta, { color: colors.muted }]}>
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
              <Ionicons name="close" size={16} color={colors.muted} />
            </Pressable>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  kcal: {
    fontSize: 13,
    fontWeight: '600',
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    fontSize: 13,
    paddingVertical: 10,
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  entryText: {
    flex: 1,
  },
  entryName: {
    fontSize: 15,
    fontWeight: '600',
  },
  entryMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  entryKcal: {
    fontSize: 14,
    fontWeight: '700',
  },
  remove: {
    padding: 2,
  },
});
