import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; // Novo import
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// Expandir o tipo para incluir nomes de MaterialCommunityIcons se necessário,
// ou tratar de forma diferente. Por simplicidade, vamos adicionar ao MAPPING
// e assumir que podemos identificar a origem.

type IconMapping = Record<string, { set: 'MaterialIcons' | 'MaterialCommunityIcons'; name: ComponentProps<typeof MaterialIcons>['name'] | ComponentProps<typeof MaterialCommunityIcons>['name'] }>;

// O nome 'clover' vem de MaterialCommunityIcons
// O nome 'star.fill' é um nome SF Symbol que mapeamos para um MaterialIcon
const MAPPING: IconMapping = {
  'house.fill': { set: 'MaterialIcons', name: 'home' },
  'chevron.right': { set: 'MaterialIcons', name: 'chevron-right' },
  'star.fill': { set: 'MaterialIcons', name: 'star' }, // Mantendo o antigo para referência
  'clover.fill': { set: 'MaterialCommunityIcons', name: 'clover' }, // Novo ícone
  'sun.max.fill': { set: 'MaterialIcons', name: 'wb-sunny' },
  'moon.fill': { set: 'MaterialIcons', name: 'brightness-3' },
};

export function IconSymbol({
  name, // Agora pode ser 'clover.fill'
  size = 24,
  color,
  style,
  // weight não é usado por MaterialIcons ou MaterialCommunityIcons, pode ser removido ou ignorado aqui
}: {
  name: keyof typeof MAPPING | SymbolViewProps['name']; // Ajustar o tipo se for usar apenas do MAPPING
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight; // Ignorado para Material*Icons
}) {
  const iconInfo = MAPPING[name as string];

  if (iconInfo) {
    if (iconInfo.set === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons color={color as string} size={size} name={iconInfo.name as any} style={style} />;
    }
    // Por padrão, ou se for MaterialIcons
    return <MaterialIcons color={color} size={size} name={iconInfo.name as any} style={style} />;
  }

  // Fallback para um ícone de ajuda se o nome não for encontrado no MAPPING
  // ou se o nome for um SF Symbol não mapeado (para Android/Web)
  console.warn(`IconSymbol: Ícone não mapeado '${name}', usando fallback 'help-outline'.`);
  return <MaterialIcons color={color} size={size} name="help-outline" style={style} />;
}