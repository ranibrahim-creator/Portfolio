import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip } from '@/components/Chip';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/components/useTheme';
import { formatKcal } from '@/lib/format';
import { goalsFromProfile, tdee } from '@/lib/nutrition';
import { useApp } from '@/store/AppProvider';
import type { Activity, Goal, Sex } from '@/types';

const SEX_OPTIONS: { id: Sex; label: string }[] = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
];

const GOAL_OPTIONS: { id: Goal; label: string }[] = [
  { id: 'lose', label: 'Lose' },
  { id: 'maintain', label: 'Maintain' },
  { id: 'gain', label: 'Gain' },
];

const ACTIVITY_OPTIONS: { id: Activity; label: string }[] = [
  { id: 'sedentary', label: 'Desk' },
  { id: 'light', label: 'Light' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'active', label: 'Active' },
  { id: 'very_active', label: 'Athlete' },
];

export default function ProfileScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useApp();
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(String(profile.age));
  const [heightCm, setHeightCm] = useState(String(profile.heightCm));
  const [weightKg, setWeightKg] = useState(String(profile.weightKg));
  const [calorieGoal, setCalorieGoal] = useState(String(profile.calorieGoal));

  const estimated = useMemo(() => {
    const weight = Number(weightKg) || profile.weightKg;
    const height = Number(heightCm) || profile.heightCm;
    const years = Number(age) || profile.age;
    const energy = tdee(profile.sex, weight, height, years, profile.activity);
    return goalsFromProfile({
      sex: profile.sex,
      weightKg: weight,
      heightCm: height,
      age: years,
      activity: profile.activity,
      goal: profile.goal,
    });
  }, [age, heightCm, profile.activity, profile.goal, profile.sex, profile.weightKg, profile.heightCm, profile.age, weightKg]);

  const initials = (profile.name || 'Nourish')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const applyCalculated = () => {
    const weight = Number(weightKg) || profile.weightKg;
    const height = Number(heightCm) || profile.heightCm;
    const years = Number(age) || profile.age;
    const next = goalsFromProfile({
      sex: profile.sex,
      weightKg: weight,
      heightCm: height,
      age: years,
      activity: profile.activity,
      goal: profile.goal,
    });
    updateProfile({
      name: name.trim(),
      age: years,
      heightCm: height,
      weightKg: weight,
      ...next,
    });
    setCalorieGoal(String(next.calorieGoal));
  };

  const saveManualGoal = () => {
    const calories = Math.max(1000, Number(calorieGoal) || profile.calorieGoal);
    updateProfile({
      name: name.trim(),
      calorieGoal: calories,
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: colors.text }]}>You</Text>

          <View style={[styles.hero, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
              <Text style={[styles.avatarText, { color: colors.inverted }]}>{initials || 'N'}</Text>
            </View>
            <TextInput
              value={name}
              onChangeText={setName}
              onBlur={() => updateProfile({ name: name.trim() })}
              placeholder="Your name"
              placeholderTextColor={colors.muted}
              style={[styles.nameInput, { color: colors.text, borderColor: colors.border }]}
            />
            <Text style={[styles.heroMeta, { color: colors.muted }]}>
              {formatKcal(profile.calorieGoal)} kcal target · {profile.goal} weight
            </Text>
          </View>

          <View style={styles.macroGrid}>
            <GoalTile label="Calories" value={`${formatKcal(profile.calorieGoal)}`} colors={colors} />
            <GoalTile label="Protein" value={`${profile.proteinGoal}g`} colors={colors} />
            <GoalTile label="Carbs" value={`${profile.carbsGoal}g`} colors={colors} />
            <GoalTile label="Fat" value={`${profile.fatGoal}g`} colors={colors} />
          </View>

          <Text style={[styles.sectionLabel, { color: colors.muted }]}>Daily calorie goal</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              value={calorieGoal}
              onChangeText={setCalorieGoal}
              keyboardType="number-pad"
              style={[styles.field, { color: colors.text, borderColor: colors.border }]}
            />
            <PrimaryButton label="Save calorie goal" onPress={saveManualGoal} />
          </View>

          <Text style={[styles.sectionLabel, { color: colors.muted }]}>Calculate from stats</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, gap: 14 }]}>
            <Field label="Age" value={age} onChangeText={setAge} colors={colors} />
            <Field label="Height (cm)" value={heightCm} onChangeText={setHeightCm} colors={colors} />
            <Field label="Weight (kg)" value={weightKg} onChangeText={setWeightKg} colors={colors} />

            <Text style={[styles.fieldLabel, { color: colors.muted }]}>Sex</Text>
            <View style={styles.chips}>
              {SEX_OPTIONS.map((option) => (
                <Chip
                  key={option.id}
                  label={option.label}
                  selected={profile.sex === option.id}
                  onPress={() => updateProfile({ sex: option.id })}
                />
              ))}
            </View>

            <Text style={[styles.fieldLabel, { color: colors.muted }]}>Goal</Text>
            <View style={styles.chips}>
              {GOAL_OPTIONS.map((option) => (
                <Chip
                  key={option.id}
                  label={option.label}
                  selected={profile.goal === option.id}
                  onPress={() => updateProfile({ goal: option.id })}
                />
              ))}
            </View>

            <Text style={[styles.fieldLabel, { color: colors.muted }]}>Activity</Text>
            <View style={styles.chips}>
              {ACTIVITY_OPTIONS.map((option) => (
                <Chip
                  key={option.id}
                  label={option.label}
                  selected={profile.activity === option.id}
                  onPress={() => updateProfile({ activity: option.id })}
                />
              ))}
            </View>

            <Text style={[styles.estimate, { color: colors.muted }]}>
              Suggested target: {formatKcal(estimated.calorieGoal)} kcal
            </Text>
            <PrimaryButton label="Use calculated goals" onPress={applyCalculated} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function GoalTile({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={[styles.tile, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.tileLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.tileValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  colors: ReturnType<typeof useTheme>;
}) {
  return (
    <View>
      <Text style={[styles.fieldLabel, { color: colors.muted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        style={[styles.field, { color: colors.text, borderColor: colors.border }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 14,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  hero: {
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
  },
  nameInput: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    minWidth: 180,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 4,
  },
  heroMeta: {
    fontSize: 13,
    fontWeight: '600',
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tile: {
    width: '48%',
    flexGrow: 1,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  tileLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  tileValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 6,
  },
  card: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  field: {
    height: 48,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '600',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  estimate: {
    fontSize: 13,
    fontWeight: '600',
  },
});
