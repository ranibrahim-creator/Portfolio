import type { ThemeColors } from '@/constants/Colors';
import type { CalorieStatus } from '@/lib/nutrition';

export function statusColor(status: CalorieStatus, colors: ThemeColors): string {
  switch (status) {
    case 'under':
      return colors.under;
    case 'track':
      return colors.tint;
    case 'near':
      return colors.near;
    case 'over':
      return colors.over;
    default:
      return colors.placeholder;
  }
}
