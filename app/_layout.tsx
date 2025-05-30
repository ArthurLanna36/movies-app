// app/_layout.tsx
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useFonts } from "expo-font";
import { useEffect, useState } from "react"; // React importado
import { View } from "react-native"; // View importado
import {
  adaptNavigationTheme,
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  Menu,
  PaperProvider,
  Text as PaperText, // PaperText importado
} from "react-native-paper";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import {
  AppThemeProvider,
  useTheme as useAppThemeHook,
} from "@/context/ThemeContext";
import * as ExpoSplashScreen from "expo-splash-screen";

ExpoSplashScreen.preventAutoHideAsync();

const { LightTheme: AdaptedNavigationLight, DarkTheme: AdaptedNavigationDark } =
  adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

function AuthGuardedApp() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { theme: appThemeValue, toggleTheme } = useAppThemeHook();
  const { signOut } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  const [settingsMenuVisible, setSettingsMenuVisible] = useState(false);
  const openSettingsMenu = () => setSettingsMenuVisible(true);
  const closeSettingsMenu = () => setSettingsMenuVisible(false);

  const basePaperTheme =
    appThemeValue === "dark" ? MD3DarkTheme : MD3LightTheme;
  const navigationTheme =
    appThemeValue === "dark" ? AdaptedNavigationDark : AdaptedNavigationLight;
  const paperTheme = {
    ...basePaperTheme,
    colors: { ...basePaperTheme.colors, ...navigationTheme.colors },
  };

  useEffect(() => {
    if (isAuthLoading) return;

    const inAuthGroup =
      segments.length > 0 && (segments[0] as string) === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, isAuthLoading, segments, router]);

  const handleSignOut = async () => {
    closeSettingsMenu();
    await signOut();
  };

  if (isAuthLoading) {
    return null;
  }

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationThemeProvider value={navigationTheme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: paperTheme.colors.card },
            headerTintColor: paperTheme.colors.text,
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: !!user, // Mostra header apenas se estiver logado e na rota (tabs)
              title: "MovieDeck",
              headerTitleStyle: {
                fontFamily: "GlassAntiqua-Inline",
                fontSize: 50,
              },
              headerRight: () => (
                <Menu
                  visible={settingsMenuVisible}
                  onDismiss={closeSettingsMenu}
                  anchor={
                    <IconButton
                      icon="cog"
                      iconColor={paperTheme.colors.text}
                      onPress={openSettingsMenu}
                      style={{ marginRight: 5 }}
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
                        size={22}
                        color={paperTheme.colors.text}
                      />
                    )}
                    titleStyle={{
                      color: paperTheme.colors.text,
                      fontFamily: "GlassAntiqua-Inline",
                      fontSize: 16,
                    }}
                  />
                  {user && (
                    <Menu.Item
                      onPress={handleSignOut}
                      title="Sign Out"
                      leadingIcon={() => (
                        <IconSymbol
                          name="logout"
                          size={22}
                          color={paperTheme.colors.text}
                        />
                      )}
                      titleStyle={{
                        color: paperTheme.colors.text,
                        fontFamily: "GlassAntiqua-Inline",
                        fontSize: 16,
                      }}
                    />
                  )}
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
      ExpoSplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  if (fontError) {
    console.error("Error loading fonts:", fontError);
    return (
      <PaperProvider>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <PaperText style={{ textAlign: "center" }}>
            Error loading fonts. Please ensure the font file exists at
            assets/fonts/GlassAntiqua-Regular.ttf and restart the app.
          </PaperText>
        </View>
      </PaperProvider>
    );
  }

  return (
    <AppThemeProvider>
      <AuthProvider>
        <AuthGuardedApp />
      </AuthProvider>
    </AppThemeProvider>
  );
}
