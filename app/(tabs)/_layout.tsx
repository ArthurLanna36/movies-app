import {
  createMaterialTopTabNavigator
} from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

// Atualize o ParamList se você quiser tipagem estrita para a rota "roleta"
export type TopTabsParamList = {
  index: undefined; // <<< ATUALIZADO DE 'index' PARA 'roleta'
  // Adicione outras telas aqui se necessário, ex:
  // settings: { userId: string };
};

const { Navigator: TopTabsMaterialNavigator } =
  createMaterialTopTabNavigator<TopTabsParamList>();

export const MaterialTopTabs = withLayoutContext(TopTabsMaterialNavigator);

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <>
      <MaterialTopTabs
        initialRouteName="index" // <<< ATUALIZADO DE 'index' PARA 'roleta'
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
            fontFamily: 'GlassAntiqua-Regular', // Ou a fonte que estiver usando
            fontSize: 16, // Ajuste conforme necessário
          },
        }}
      >
        <MaterialTopTabs.Screen
          name="index" // <<< ATUALIZADO DE 'index' PARA 'roleta'
          options={{
            tabBarLabel: 'index', // O texto que aparece na aba
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <IconSymbol size={focused ? 22 : 18} name="star.fill" color={color} />
            ),
          }}
        />
        {/* Exemplo de outra aba, se tivesse:
        <MaterialTopTabs.Screen
          name="settings"
          // component={SettingsScreenComponent} // Você precisaria criar este componente
          options={{
            tabBarLabel: 'Config',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol size={focused ? 22 : 18} name="gear" color={color} /> 
            ),
          }}
        />
        */}
      </MaterialTopTabs>
    </>
  );
}