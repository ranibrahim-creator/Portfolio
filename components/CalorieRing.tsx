import Svg, { Circle } from 'react-native-svg';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/components/useTheme';
import { formatKcal } from '@/lib/format';
import { calorieStatus } from '@/lib/nutrition';
import { statusColor } from '@/lib/statusColor';

type Props = {
  eaten: number;
  goal: number;
  size?: number;
};

export function CalorieRing({ eaten, goal, size = 200 }: Props) {
  const colors = useTheme();
  const remaining = Math.round(goal - eaten);
  const over = remaining < 0;
  const progress = goal <= 0 ? 0 : Math.min(eaten / goal, 1);
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const fill = statusColor(calorieStatus(eaten, goal), colors);

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
          stroke={fill}
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
        <Text style={[styles.kicker, { color: colors.muted }]}>{over ? 'OVER' : 'REMAINING'}</Text>
        <Text style={[styles.value, { color: over ? colors.over : colors.hero }]}>
          {formatKcal(Math.abs(remaining))}
        </Text>
        <Text style={[styles.sub, { color: colors.muted }]}>calories</Text>
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
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  value: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
    lineHeight: 52,
  },
  sub: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
  },
});
