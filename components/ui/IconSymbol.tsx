import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'] | string, ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  'house.fill': 'home',
  'chevron.right': 'chevron-right',
  'star.fill': 'star',
  'sun.max.fill': 'wb-sunny', // Ícone de Sol
  'moon.fill': 'brightness-3', // Ícone de Lua
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight, 
}: {
  name: IconSymbolName | SymbolViewProps['name'];
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const materialIconName = MAPPING[name as string] || 'help-outline'; 
  return <MaterialIcons color={color} size={size} name={materialIconName} style={style} />;
}