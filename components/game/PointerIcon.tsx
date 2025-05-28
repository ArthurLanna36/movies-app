// components/game/PointerIcon.tsx
import { POINTER_COLOR, POINTER_SIZE } from '@/constants/GameSettings';
import { FontAwesome } from '@expo/vector-icons';

export function PointerIcon() {
  return (
    <FontAwesome name="caret-down" size={POINTER_SIZE} color={POINTER_COLOR} />
  );
}