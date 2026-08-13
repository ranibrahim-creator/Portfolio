const tintLight = '#1F7A4D';
const tintDark = '#5DCAA0';

const Colors = {
  light: {
    text: '#1A2E24',
    muted: '#6B7C73',
    background: '#F3F6F2',
    surface: '#FFFFFF',
    surfaceMuted: '#E8EEE9',
    border: '#DCE6DF',
    tint: tintLight,
    tintSoft: '#E4F4EA',
    tabIconDefault: '#9AA89F',
    tabIconSelected: tintLight,
    protein: '#E07A5F',
    carbs: '#3D8B6E',
    fat: '#D4A017',
    over: '#C44536',
    water: '#4C9ADF',
    ringTrack: '#E4EBE6',
    inverted: '#FFFFFF',
    shadow: 'rgba(26, 46, 36, 0.08)',
  },
  dark: {
    text: '#EEF3EF',
    muted: '#8A9A90',
    background: '#121A16',
    surface: '#1C2620',
    surfaceMuted: '#24302A',
    border: '#2C3A32',
    tint: tintDark,
    tintSoft: '#1E3329',
    tabIconDefault: '#6B7C73',
    tabIconSelected: tintDark,
    protein: '#F0A38C',
    carbs: '#7BC4A4',
    fat: '#E9C46A',
    over: '#E06A5C',
    water: '#7EB8EA',
    ringTrack: '#2A3831',
    inverted: '#121A16',
    shadow: 'rgba(0, 0, 0, 0.35)',
  },
};

export type ThemeColors = (typeof Colors)['light'];

export default Colors;
