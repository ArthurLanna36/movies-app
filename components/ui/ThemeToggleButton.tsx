import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from './IconSymbol';

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  const iconColor = Colors[theme]?.text || Colors.light.text;

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.button}>
      {theme === 'light' ? (
        <IconSymbol name="moon.fill" size={24} color={iconColor} />
      ) : (
        <IconSymbol name="sun.max.fill" size={24} color={iconColor} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 15,
    padding: 5,
  },
});