import { useColorScheme } from '@/components/useColorScheme';
import Colors, { type ThemeColors } from '@/constants/Colors';

export function useTheme(): ThemeColors {
  const scheme = useColorScheme() ?? 'light';
  return Colors[scheme === 'dark' ? 'dark' : 'light'];
}
