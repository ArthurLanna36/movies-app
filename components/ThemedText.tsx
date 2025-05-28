import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: 'GlassAntiqua-Inline',
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontFamily: 'GlassAntiqua-Inline',
    fontSize: 16,
    lineHeight: 24,
    // fontWeight: '600', // GlassAntiqua-Inline é uma fonte display, fontWeight pode não ter muito efeito ou o desejado
  },
  title: {
    fontFamily: 'GlassAntiqua-Inline',
    fontSize: 32,
    // fontWeight: 'bold', // Como acima
    lineHeight: 38, // Ajustar lineHeight para fontes display
  },
  subtitle: {
    fontFamily: 'GlassAntiqua-Inline',
    fontSize: 20,
    // fontWeight: 'bold', // Como acima
    lineHeight: 28, // Ajustar lineHeight
  },
  link: {
    fontFamily: 'GlassAntiqua-Inline',
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4', // Cor do link pode ser mantida ou também tematizada se desejar
  },
});