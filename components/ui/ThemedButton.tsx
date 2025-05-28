import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { ActivityIndicator, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  colorType?: 'primary' | 'destructive' | 'default';
}

export const ThemedButton = ({
  title,
  onPress,
  disabled,
  isLoading,
  style,
  textStyle,
  colorType = 'primary',
}: ThemedButtonProps) => {
  const { theme } = useTheme();

  let backgroundColor: string;
  let textColor: string;
  let borderColor: string | undefined = undefined;

  const defaultLightButtonTextColor = '#FFFFFF';
  const defaultDarkButtonTextColor = Colors.dark.background; 

  switch (colorType) {
    case 'destructive':
      backgroundColor = theme === 'light' ? '#FFEBEE' : '#D32F2F'; 
      textColor = theme === 'light' ? '#D32F2F' : '#FFCDD2';    
      borderColor = theme === 'light' ? '#EF5350' : '#C62828';
      break;
    case 'primary':
    default:
      backgroundColor = Colors[theme]?.tint || Colors.light.tint;
      textColor = theme === 'light' ? (Colors.light.buttonText || defaultLightButtonTextColor)
                                    : (Colors.dark.buttonText || Colors.dark.text); 
      borderColor = backgroundColor; // Para botões primários, a borda pode ser a mesma que o fundo
      break;
  }

  if (disabled || isLoading) { 
    backgroundColor = Colors[theme]?.icon || Colors.light.icon; 
    textColor = theme === 'light'
        ? (Colors.light.background || '#CCCCCC')
        : (Colors.dark.text || '#666666');
    borderColor = backgroundColor;
  }


  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        { backgroundColor, borderColor, borderWidth: 1 }, // Sempre terá borda
        style,
        (disabled || isLoading) && styles.disabledButton
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        // Usando ThemedText aqui para que a fonte GlassAntiqua-Inline seja aplicada
        // se o tipo 'default' ou outro tipo relevante no ThemedText usar essa fonte.
        // Se precisar de um estilo de texto específico para o botão, pode passar em textStyle.
        <ThemedText type="defaultSemiBold" style={[styles.text, { color: textColor }, textStyle]}>
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    // borderWidth: 1, // Movido para o style inline para controlar a cor da borda
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: 30,
    // fontWeight já vem do defaultSemiBold do ThemedText
    textAlign: 'center', // Garantir centralização
  },
});