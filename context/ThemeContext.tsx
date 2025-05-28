import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName, useColorScheme as useSystemColorScheme } from 'react-native';

type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isSystemTheme: boolean;
  setAppTheme: (theme: Theme | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useSystemColorScheme();
  const [userPreference, setUserPreference] = useState<'light' | 'dark' | 'system'>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<Theme>(systemColorScheme ?? 'light');

  useEffect(() => {
    if (userPreference === 'system') {
      setEffectiveTheme(systemColorScheme ?? 'light');
    } else {
      setEffectiveTheme(userPreference);
    }
  }, [userPreference, systemColorScheme]);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      if (userPreference === 'system') {
        setEffectiveTheme(colorScheme ?? 'light');
      }
    });
    return () => subscription.remove();
  }, [userPreference]);

  const toggleTheme = () => {
    const currentThemeToToggle = effectiveTheme;
    const newTheme = currentThemeToToggle === 'light' ? 'dark' : 'light';
    setUserPreference(newTheme);
    setEffectiveTheme(newTheme);
  };

  const setAppTheme = (newPreference: Theme | 'system') => {
    setUserPreference(newPreference);
    if (newPreference === 'system') {
      setEffectiveTheme(systemColorScheme ?? 'light');
    } else {
      setEffectiveTheme(newPreference);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: effectiveTheme, toggleTheme, isSystemTheme: userPreference === 'system', setAppTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within an AppThemeProvider');
  }
  return context;
};