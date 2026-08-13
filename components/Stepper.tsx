import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/components/useTheme';

type Props = {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
};

export function Stepper({ value, onChange, step = 0.5, min = 0.5 }: Props) {
  const colors = useTheme();
  const display = Number.isInteger(value) ? `${value}` : value.toFixed(1);

  const bump = (delta: number) => {
    Haptics.selectionAsync();
    const next = Math.round((value + delta) * 10) / 10;
    onChange(Math.max(min, next));
  };

  return (
    <View style={[styles.wrap, { backgroundColor: colors.surfaceMuted }]}>
      <Pressable onPress={() => bump(-step)} style={styles.btn} hitSlop={8}>
        <Ionicons name="remove" size={18} color={colors.text} />
      </Pressable>
      <Text style={[styles.value, { color: colors.text }]}>{display}</Text>
      <Pressable onPress={() => bump(step)} style={styles.btn} hitSlop={8}>
        <Ionicons name="add" size={18} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 6,
    height: 44,
  },
  btn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    minWidth: 48,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
});
