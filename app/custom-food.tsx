import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/PrimaryButton';
import { useTheme } from '@/components/useTheme';
import { useApp } from '@/store/AppProvider';

export default function CustomFoodScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { addCustomFood, addFood, selectedMeal } = useApp();
  const [name, setName] = useState('');
  const [servingLabel, setServingLabel] = useState('1 serving');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const parsed = {
    name: name.trim(),
    servingLabel: servingLabel.trim() || '1 serving',
    calories: Number(calories),
    protein: Number(protein) || 0,
    carbs: Number(carbs) || 0,
    fat: Number(fat) || 0,
  };
  const valid = parsed.name.length > 0 && parsed.calories > 0;

  const save = (alsoLog: boolean) => {
    const food = addCustomFood(parsed);
    if (alsoLog) addFood(food, 1, selectedMeal);
    router.back();
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top + 8 }]}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.close}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.kicker, { color: colors.muted }]}>Custom food</Text>
        <View style={styles.close} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: colors.text }]}>Create a food</Text>
          <Field label="Name" value={name} onChangeText={setName} placeholder="Overnight oats" colors={colors} />
          <Field
            label="Serving"
            value={servingLabel}
            onChangeText={setServingLabel}
            placeholder="1 bowl"
            colors={colors}
            keyboardType="default"
          />
          <Field label="Calories" value={calories} onChangeText={setCalories} placeholder="320" colors={colors} />
          <View style={styles.row}>
            <View style={styles.flex}>
              <Field label="Protein (g)" value={protein} onChangeText={setProtein} placeholder="20" colors={colors} />
            </View>
            <View style={styles.flex}>
              <Field label="Carbs (g)" value={carbs} onChangeText={setCarbs} placeholder="40" colors={colors} />
            </View>
            <View style={styles.flex}>
              <Field label="Fat (g)" value={fat} onChangeText={setFat} placeholder="8" colors={colors} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton label="Save and log" onPress={() => save(true)} disabled={!valid} />
        <Pressable disabled={!valid} onPress={() => save(false)} style={styles.secondary}>
          <Text style={[styles.secondaryLabel, { color: colors.tint, opacity: valid ? 1 : 0.4 }]}>Save only</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  colors,
  keyboardType = 'decimal-pad',
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  colors: ReturnType<typeof useTheme>;
  keyboardType?: 'decimal-pad' | 'default';
}) {
  return (
    <View>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
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
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  close: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  body: {
    padding: 20,
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  footer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  secondary: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
});
