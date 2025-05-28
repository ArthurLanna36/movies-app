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
        initialRouteName="index"
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
            fontFamily: 'GlassAntiqua-Regular',
            fontSize: 25, // Seu tamanho ajustado
            // textTransform: 'none', // Para evitar que o texto fique em maiúsculas se for o padrão
          },
          // NOVO: Adicionar tabBarItemStyle
          tabBarItemStyle: {
            // flexDirection: 'row', // MaterialTopTabs geralmente já é row por padrão para ícone e label juntos
            alignItems: 'center', // Ajuda a centralizar o conteúdo (ícone + texto)
            justifyContent: 'center',
            paddingVertical: 2, // Adiciona um pouco de padding vertical dentro de cada item da aba
            // paddingHorizontal: 5, // Pode adicionar padding horizontal também se necessário
          },
          //  tabBarIconStyle: { // Pode não ter o efeito desejado de espaçamento com o texto
          //    marginRight: 0, // Tentar zerar ou ajustar margens padrões se houver
          //  }
        }}
      >
        <MaterialTopTabs.Screen
          name="index"
          options={{
            tabBarLabel: 'Roleta',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <IconSymbol
                size={focused ? 28 : 24} // Seu tamanho ajustado
                name="clover.fill"
                color={color}
                style={{ marginRight: 5 }} // Adiciona uma margem à direita do ícone
              />
            ),
          }}
        />
      </MaterialTopTabs>
    </>
  );
}