// app/_layout.tsx
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

// Import React and useState for managing menu visibility
import { useEffect, useState } from "react"; // Added React and useState
// Import Menu and IconButton from react-native-paper
import {
  adaptNavigationTheme,
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  Menu,
  PaperProvider,
} from "react-native-paper"; // Added Menu, IconButton

// Removed ThemeToggleButton import as it's now integrated into the Menu
import { IconSymbol } from "@/components/ui/IconSymbol"; // For icons within the Menu
import {
  AppThemeProvider,
  useTheme as useAppThemeHook,
} from "@/context/ThemeContext";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

// Adapts navigation themes to be compatible with Paper themes
const { LightTheme: AdaptedNavigationLight, DarkTheme: AdaptedNavigationDark } =
  adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

function AppNavigation() {
  const { theme: appThemeValue, toggleTheme } = useAppThemeHook(); // Get toggleTheme here

  const basePaperTheme =
    appThemeValue === "dark" ? MD3DarkTheme : MD3LightTheme;
  const navigationTheme =
    appThemeValue === "dark" ? AdaptedNavigationDark : AdaptedNavigationLight;

  const paperTheme = {
    ...basePaperTheme,
    colors: {
      ...basePaperTheme.colors,
      ...navigationTheme.colors,
    },
  };

  // State for settings menu visibility
  const [settingsMenuVisible, setSettingsMenuVisible] = useState(false);
  const openSettingsMenu = () => setSettingsMenuVisible(true);
  const closeSettingsMenu = () => setSettingsMenuVisible(false);

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: true,
              title: "MovieDeck", // Your chosen title
              headerTitleStyle: {
                fontFamily: "GlassAntiqua-Inline",
                fontSize: 50,
              },
              headerStyle: {
                backgroundColor: navigationTheme.colors.card,
              },
              headerTintColor: navigationTheme.colors.text,
              // headerRight is now a Menu anchored to a gear IconButton
              headerRight: () => (
                <Menu
                  visible={settingsMenuVisible}
                  onDismiss={closeSettingsMenu}
                  anchor={
                    <IconButton
                      icon="cog" // Gear icon
                      iconColor={navigationTheme.colors.text}
                      onPress={openSettingsMenu}
                      style={{ marginRight: 5 }} // Added some margin for better spacing
                    />
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      toggleTheme();
                      closeSettingsMenu();
                    }}
                    title={
                      appThemeValue === "dark" ? "Light Mode" : "Dark Mode"
                    }
                    leadingIcon={() => (
                      <IconSymbol
                        name={
                          appThemeValue === "dark"
                            ? "sun.max.fill"
                            : "moon.fill"
                        }
                        size={22} // Standard size for menu icons
                        color={navigationTheme.colors.text} // Icon color within the menu
                      />
                    )}
                    titleStyle={{
                      color: navigationTheme.colors.text, // Text color for the menu item
                      fontFamily: "GlassAntiqua-Inline", // Apply custom font to menu item
                      fontSize: 16, // Adjusted font size for menu item
                    }}
                  />
                  {/* You can add more Menu.Items here for future settings */}
                  {/* For example:
                    <Menu.Item
                      onPress={() => { console.log('About pressed'); closeSettingsMenu(); }}
                      title="About"
                      titleStyle={{ color: navigationTheme.colors.text, fontFamily: 'GlassAntiqua-Inline', fontSize: 16 }}
                      leadingIcon={() => <IconSymbol name="information.circle" size={22} color={navigationTheme.colors.text} />}
                    />
                  */}
                </Menu>
              ),
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
    "GlassAntiqua-Inline": require("../assets/fonts/GlassAntiqua-Regular.ttf"),
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
    console.error("Error loading fonts:", fontError);
  }

  return (
    <AppThemeProvider>
      <AppNavigation />
    </AppThemeProvider>
  );
}
