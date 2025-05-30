// app/(tabs)/_layout.tsx
import React from "react";
import { BottomNavigation } from "react-native-paper";

import { IconSymbol } from "@/components/ui/IconSymbol"; // Assuming IconSymbol is compatible or we adapt its usage
import { Colors } from "@/constants/Colors";
import { useTheme as useAppThemeHook } from "@/context/ThemeContext"; // Renamed to avoid conflict with Paper's useTheme

// Import your screen components
import RouletteScreen from "./index";
import WatchedScreen from "./watched";

export default function TabLayout() {
  const { theme } = useAppThemeHook(); // Your app's theme context
  const [index, setIndex] = React.useState(0);

  const routes = [
    {
      key: "roulette",
      title: "Roleta", // Roulette
      focusedIcon: ({ color }: { color: string }) => (
        <IconSymbol
          name="clover.fill"
          size={26} // Adjusted size for focused
          color={color}
        />
      ),
      unfocusedIcon: ({ color }: { color: string }) => (
        <IconSymbol
          name="clover.fill"
          size={24} // Standard size
          color={color}
        />
      ),
    },
    {
      key: "watched",
      title: "Assistidos", // Watched
      focusedIcon: ({ color }: { color: string }) => (
        <IconSymbol
          name="playlist-check"
          size={26} // Adjusted size for focused
          color={color}
        />
      ),
      unfocusedIcon: ({ color }: { color: string }) => (
        <IconSymbol
          name="playlist-check"
          size={24} // Standard size
          color={color}
        />
      ),
    },
  ];

  // renderScene is used by BottomNavigation to render the component for the current tab
  const renderScene = BottomNavigation.SceneMap({
    roulette: RouletteScreen,
    watched: WatchedScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      // Apply theming from react-native-paper, which should integrate with your ThemeContext via PaperProvider
      // activeColor and inactiveColor are for the icon and label
      activeColor={Colors[theme].tint} // Or Colors[theme].tabIconSelected
      inactiveColor={Colors[theme].tabIconDefault}
      barStyle={{ backgroundColor: Colors[theme].background }}
      // Customize label style if needed, BottomNavigation has its own label handling
      // You might need to use theme prop of BottomNavigation for more granular control
      // or ensure your PaperProvider theme is correctly configured.
      // Label style for react-native-paper BottomNavigation is often handled by the theme.
      // If specific font is needed for labels, it might require theme customization for Paper.
      // For IconSymbol, we're now using focusedIcon/unfocusedIcon.
    />
  );
}
