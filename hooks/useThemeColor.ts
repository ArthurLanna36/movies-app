import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { theme: currentTheme } = useTheme();
  const colorFromProps = props[currentTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    if (Colors[currentTheme] && Colors[currentTheme][colorName]) {
      return Colors[currentTheme][colorName];
    }
    console.warn(`Theme color not found for theme: "${currentTheme}", colorName: "${colorName}". Falling back to light theme's text color.`);
    return Colors.light.text;
  }
}