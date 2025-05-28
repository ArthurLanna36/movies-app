import {
  createMaterialTopTabNavigator
} from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router'; // Manter Stack se for usar para options de header globais

// Seus outros imports
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Defina seu ParamList para as abas.
// Mesmo que só tenha 'index', é bom para tipagem.
export type TopTabsParamList = {
  index: undefined; // A tela 'index' não espera parâmetros
  // Adicione outras telas aqui se necessário, ex:
  // settings: { userId: string };
};

const { Navigator: TopTabsMaterialNavigator, Screen: TopTabsMaterialScreen } =
  createMaterialTopTabNavigator<TopTabsParamList>();

// Tentar sem especificar os genéricos diretamente no withLayoutContext,
// deixando a inferência de tipos do Navigator tipado acima funcionar.
// Se isso ainda der erro sobre "4 type arguments", a API do withLayoutContext na sua versão
// pode ser mais estrita.
export const MaterialTopTabs = withLayoutContext(TopTabsMaterialNavigator);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Opções para o Stack que envolve este layout de abas, se você quiser um título global ACIMA das abas.
  // Se não precisar de um título global aqui, pode remover este <Stack.Screen />.
  // Este Stack.Screen refere-se ao Stack definido em app/_layout.tsx.
  // Se você quiser que o título apareça na barra de app principal (acima das abas):
  // <Stack.Screen options={{ title: 'Roleta App' }} />

  return (
    <>
      {/* Se você quer um título específico para este conjunto de abas,
          mas que NÃO seja parte da barra de abas em si, configure no Stack.Screen do _layout.tsx pai.
          Exemplo em app/_layout.tsx (ou onde o Stack que contém '(tabs)' está):
          <Stack.Screen name="(tabs)" options={{ title: 'Minha Roleta' }} />
      */}
      <MaterialTopTabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Para Android, se necessário
          },
          tabBarIndicatorStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].tint,
          },
          // tabBarShowIcon: true, // Para mostrar ícones, se desejado
          // tabBarShowLabel: true, // Para mostrar labels (padrão é true)
        }}
      >
        <MaterialTopTabs.Screen // Pode usar TopTabsMaterialScreen também, mas .Screen do exportado deve funcionar
          name="index"
          options={{
            tabBarLabel: 'Roleta',
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => ( // Tipagem explícita aqui
              <IconSymbol size={focused ? 22 : 18} name="star.fill" color={color} />
            ),
          }}
        />
        {/* Exemplo de outra aba, se tivesse:
        <MaterialTopTabs.Screen
          name="settings"
          component={SettingsScreenComponent} // Você precisaria criar este componente
          options={{
            tabBarLabel: 'Config',
            tabBarIcon: ({ color, focused }) => (
              <IconSymbol size={focused ? 22 : 18} name="gear" color={color} /> // Supondo um ícone 'gear'
            ),
          }}
        />
        */}
      </MaterialTopTabs>
    </>
  );
}