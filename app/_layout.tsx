// app/_layout.tsx
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { ThemeToggleButton } from "@/components/ui/ThemeToggleButton"; //
import {
  AppThemeProvider,
  useTheme as useAppThemeHook,
} from "@/context/ThemeContext"; //

import { useFonts } from "expo-font"; //
import * as SplashScreen from "expo-splash-screen"; //
import { useEffect } from "react"; //
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper"; //

SplashScreen.preventAutoHideAsync(); //

// Adapts navigation themes to be compatible with Paper themes
const { LightTheme: AdaptedNavigationLight, DarkTheme: AdaptedNavigationDark } =
  adaptNavigationTheme({
    //
    reactNavigationLight: NavigationDefaultTheme, //
    reactNavigationDark: NavigationDarkTheme, //
  });

function AppNavigation() {
  const { theme: appThemeValue } = useAppThemeHook(); //

  const basePaperTheme =
    appThemeValue === "dark" ? MD3DarkTheme : MD3LightTheme; //
  const navigationTheme =
    appThemeValue === "dark" ? AdaptedNavigationDark : AdaptedNavigationLight; //

  const paperTheme = {
    //
    ...basePaperTheme, //
    colors: {
      //
      ...basePaperTheme.colors, //
      ...navigationTheme.colors, //
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: true, //
              title: "MovieDeck", // UPDATED TITLE
              headerRight: () => <ThemeToggleButton />, //
              headerTitleStyle: {
                //
                fontFamily: "GlassAntiqua-Inline", //
                fontSize: 40, //
              },
              headerStyle: {
                //
                backgroundColor: navigationTheme.colors.card, //
              },
              headerTintColor: navigationTheme.colors.text, //
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={appThemeValue === "dark" ? "light" : "dark"} />
      </NavigationThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    //
    "GlassAntiqua-Inline": require("../assets/fonts/GlassAntiqua-Regular.ttf"), //
  });

  useEffect(() => {
    //
    if (fontsLoaded || fontError) {
      //
      SplashScreen.hideAsync(); //
    }
  }, [fontsLoaded, fontError]); //

  if (!fontsLoaded && !fontError) {
    //
    return null; //
  }

  if (fontError) {
    //
    console.error("Error loading fonts:", fontError); //
  }

  return (
    <AppThemeProvider>
      <AppNavigation />
    </AppThemeProvider>
  );
}
