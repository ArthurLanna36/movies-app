// app/(tabs)/_layout.tsx
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";

import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";

// Atualize o ParamList para incluir a nova rota 'watched'
export type TopTabsParamList = {
  index: undefined;
  watched: undefined; // <<< NOVA ROTA
};

const { Navigator: TopTabsMaterialNavigator } =
  createMaterialTopTabNavigator<TopTabsParamList>();

export const MaterialTopTabs = withLayoutContext(TopTabsMaterialNavigator);

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <>
      <MaterialTopTabs
        initialRouteName="index" // Pode mudar para 'watched' se quiser que seja a inicial
        screenOptions={{
          tabBarActiveTintColor: Colors[theme].tint,
          tabBarInactiveTintColor: Colors[theme].tabIconDefault,
          tabBarStyle: {
            backgroundColor: Colors[theme].background,
          },
          tabBarIndicatorStyle: {
            backgroundColor: Colors[theme].tint,
          },
          tabBarLabelStyle: {
            fontFamily: "GlassAntiqua-Regular",
            fontSize: 25,
            // textTransform: 'none',
          },
          tabBarItemStyle: {
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 2,
          },
        }}
      >
        <MaterialTopTabs.Screen
          name="index"
          options={{
            tabBarLabel: "Roleta",
            tabBarIcon: ({
              color,
              focused,
            }: {
              color: string;
              focused: boolean;
            }) => (
              <IconSymbol
                size={focused ? 28 : 24}
                name="clover.fill" // Ícone para Roleta
                color={color}
                style={{ marginRight: 5 }}
              />
            ),
          }}
        />
        {/* NOVA TELA "ASSISTIDOS" */}
        <MaterialTopTabs.Screen
          name="watched" // Nome da rota (nome do arquivo .tsx)
          options={{
            tabBarLabel: "Assistidos",
            tabBarIcon: ({
              color,
              focused,
            }: {
              color: string;
              focused: boolean;
            }) => (
              <IconSymbol
                size={focused ? 28 : 24}
                name="playlist-check" // Ícone para Assistidos (verificar mapeamento)
                color={color}
                style={{ marginRight: 5 }}
              />
            ),
          }}
        />
      </MaterialTopTabs>
    </>
  );
}
