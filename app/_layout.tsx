import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeToggleButton } from '@/components/ui/ThemeToggleButton';
import { AppThemeProvider, useTheme as useAppThemeHook } from '@/context/ThemeContext'; // Renomeado para evitar conflito

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, adaptNavigationTheme } from 'react-native-paper'; // Importações do Paper

SplashScreen.preventAutoHideAsync();

// Adapta os temas de navegação para serem compatíveis com os temas do Paper
const { LightTheme: AdaptedNavigationLight, DarkTheme: AdaptedNavigationDark } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

function AppNavigation() {
  const { theme: appThemeValue } = useAppThemeHook(); // Hook do seu context

  // Define o tema base do React Native Paper
  const basePaperTheme = appThemeValue === 'dark' ? MD3DarkTheme : MD3LightTheme;
  // Define o tema de navegação adaptado
  const navigationTheme = appThemeValue === 'dark' ? AdaptedNavigationDark : AdaptedNavigationLight;

  // Cria o tema final do Paper mesclando as cores do tema base do Paper com as cores adaptadas da navegação
  // A estrutura de 'fonts' (e outras propriedades do MD3Theme) será preservada do basePaperTheme.
  const paperTheme = {
    ...basePaperTheme, // Isso inclui a estrutura correta de 'fonts' e outras propriedades do MD3Theme
    colors: {
      ...basePaperTheme.colors, // Cores base do Paper
      ...navigationTheme.colors, // Sobrescreve/adiciona cores da navegação adaptada
      // Adicione seus overrides de cores específicas do Paper aqui, se necessário
      // Ex: primary: appThemeValue === 'dark' ? 'seuDarkPrimary' : 'seuLightPrimary',
    },
  };

  return (
    // PaperProvider envolve NavigationThemeProvider
    <PaperProvider theme={paperTheme}>
      <NavigationThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: true,
              title: 'Roleta de Filmes',
              headerRight: () => <ThemeToggleButton />,
              headerTitleStyle: {
                fontFamily: 'GlassAntiqua-Inline',
                fontSize: 50,
              },
              // Para garantir que o header use as cores do tema de navegação (que agora está adaptado do Paper)
              headerStyle: {
                backgroundColor: navigationTheme.colors.card,
              },
              headerTintColor: navigationTheme.colors.text,
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={appThemeValue === 'dark' ? 'light' : 'dark'} />
      </NavigationThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'GlassAntiqua-Inline': require('../assets/fonts/GlassAntiqua-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (fontError) {
    console.error('Erro ao carregar fontes:', fontError);
    // Considerar mostrar uma mensagem de erro para o usuário
  }

  return (
    <AppThemeProvider>
      <AppNavigation />
    </AppThemeProvider>
  );
}