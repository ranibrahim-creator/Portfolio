import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '@/components/Chip';
import { FoodRow } from '@/components/FoodRow';
import { useTheme } from '@/components/useTheme';
import { CATEGORIES } from '@/data/foods';
import { useApp } from '@/store/AppProvider';
import type { FoodCategory, FoodItem } from '@/types';

export default function LogScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { allFoods, recentFoodIds, getFood, selectedMeal } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FoodCategory | 'all'>('all');

  const recentFoods = useMemo(
    () => recentFoodIds.map((id) => getFood(id)).filter((food): food is FoodItem => Boolean(food)),
    [recentFoodIds, getFood],
  );

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allFoods.filter((food) => {
      const matchesCategory = category === 'all' || food.category === category;
      const matchesQuery = !normalized || food.name.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [allFoods, category, query]);

  const openFood = (food: FoodItem) => {
    router.push({ pathname: '/log-food', params: { foodId: food.id, meal: selectedMeal } });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Log food</Text>
        <Pressable
          onPress={() => router.push('/custom-food')}
          style={[styles.customBtn, { backgroundColor: colors.tintSoft }]}>
          <Ionicons name="create-outline" size={16} color={colors.tint} />
          <Text style={[styles.customLabel, { color: colors.tint }]}>Custom</Text>
        </Pressable>
      </View>

      <View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search chicken, yogurt, rice..."
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text }]}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipScroll}>
        {CATEGORIES.map((item) => (
          <Chip
            key={item.id}
            label={item.label}
            selected={category === item.id}
            onPress={() => setCategory(item.id)}
          />
        ))}
      </ScrollView>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}>
        {query.length === 0 && category === 'all' && recentFoods.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>Recent</Text>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {recentFoods.map((food, index) => (
                <Pressable key={food.id} onPress={() => openFood(food)}>
                  <View
                    style={
                      index < recentFoods.length - 1
                        ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }
                        : undefined
                    }>
                    <FoodRow food={food} />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.muted }]}>
            {query ? `${results.length} matches` : 'Foods'}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {results.length === 0 ? (
              <Text style={[styles.empty, { color: colors.muted }]}>No foods match that search.</Text>
            ) : (
              results.map((food, index) => (
                <Pressable key={food.id} onPress={() => openFood(food)}>
                  <View
                    style={
                      index < results.length - 1
                        ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }
                        : undefined
                    }>
                    <FoodRow food={food} />
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  customBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
  },
  customLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  search: {
    marginHorizontal: 20,
    height: 48,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  chipScroll: {
    flexGrow: 0,
    marginTop: 14,
  },
  chips: {
    paddingHorizontal: 20,
    gap: 8,
  },
  list: {
    padding: 20,
    paddingBottom: 32,
    gap: 18,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  card: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
  },
  empty: {
    paddingVertical: 18,
    fontSize: 14,
  },
});
