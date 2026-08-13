import Svg, { Circle } from 'react-native-svg';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/components/useTheme';
import { formatKcal } from '@/lib/format';

type Props = {
  eaten: number;
  goal: number;
  size?: number;
};

export function CalorieRing({ eaten, goal, size = 196 }: Props) {
  const colors = useTheme();
  const remaining = Math.round(goal - eaten);
  const over = remaining < 0;
  const progress = goal <= 0 ? 0 : Math.min(eaten / goal, 1);
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.ringTrack}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={over ? colors.over : colors.tint}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={[styles.value, { color: over ? colors.over : colors.text }]}>
          {formatKcal(Math.abs(remaining))}
        </Text>
        <Text style={[styles.label, { color: colors.muted }]}>{over ? 'over goal' : 'remaining'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: -1.4,
  },
  label: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
