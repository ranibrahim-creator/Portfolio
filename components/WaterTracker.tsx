import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/components/useTheme';
import { clamp } from '@/lib/format';

type Props = {
  count: number;
  goal: number;
  onChange: (count: number) => void;
};

export function WaterTracker({ count, goal, onChange }: Props) {
  const colors = useTheme();
  const glasses = Math.max(goal, 8);

  return (
    <View style={styles.row}>
      {Array.from({ length: glasses }, (_, index) => {
        const filled = index < count;
        return (
          <Pressable
            key={index}
            onPress={() => {
              Haptics.selectionAsync();
              const next = count === index + 1 ? index : index + 1;
              onChange(clamp(next, 0, glasses));
            }}
            style={[
              styles.glass,
              {
                backgroundColor: filled ? colors.water : colors.surfaceMuted,
                opacity: filled ? 1 : 0.7,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  glass: {
    flex: 1,
    height: 28,
    borderRadius: 8,
  },
});
