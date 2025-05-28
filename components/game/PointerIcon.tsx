// components/game/PointerIcon.tsx
import { Colors } from '@/constants/Colors'; // Importar as cores
import { useTheme } from '@/context/ThemeContext'; // Importar o hook do tema
import { FontAwesome } from '@expo/vector-icons';

// Removida a constante POINTER_COLOR daqui, ela virá do tema
import { POINTER_SIZE } from '@/constants/GameSettings';

export function PointerIcon() {
  const { theme } = useTheme(); // Obter o tema atual

  // Definir a cor do ponteiro baseada no tema
  // Vamos usar a cor de 'text' do tema atual como exemplo.
  // Você pode criar uma cor específica para o ponteiro em Colors.ts se preferir.
  const pointerColor = Colors[theme]?.text || Colors.light.text; // Fallback para texto claro

  return (
    <FontAwesome name="caret-down" size={POINTER_SIZE} color={pointerColor} />
  );
}