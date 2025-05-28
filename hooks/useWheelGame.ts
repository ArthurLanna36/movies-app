// hooks/useWheelGame.ts
// (A versão que você já tem, que aceita `items: Movie[]`, está boa)
// Se certifica que ele lida bem com um array `items` vazio ou que muda de tamanho.
// A versão da minha resposta anterior de "Me mande todos os arquivos completos..." já está adaptada.
// Nenhuma mudança adicional crítica é necessária aqui se ele já recebe `items` e calcula
// `numItems` e `segmentAngleDeg` dinamicamente.
import { Movie } from '@/constants/MovieData';
import { useState } from 'react';
import { Easing, runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';

export interface UseWheelGameParams {
  items: Movie[];
  onSpinEnd?: (result: Movie) => void;
}

export function useWheelGame({ items, onSpinEnd }: UseWheelGameParams) {
  const [selectedItem, setSelectedItem] = useState<Movie | null>(null);
  const rotation = useSharedValue(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinWheelLogic = () => {
    if (isSpinning || !items || items.length < 2) { // Precisa de pelo menos 2 itens para fazer sentido girar
        console.log("Giro não iniciado: poucas opções ou já girando.");
        if(items && items.length === 1 && onSpinEnd){ // Se só tem um, já é o vencedor
            setSelectedItem(items[0]);
            runOnJS(onSpinEnd)(items[0]);
        }
        return;
    }
    setIsSpinning(true);
    setSelectedItem(null);

    const numItems = items.length;
    const segmentAngleDeg = 360 / numItems;

    const additionalRandomSpins = Math.floor(Math.random() * 2) + 3;
    const winningSegmentIndex = Math.floor(Math.random() * numItems);
    const winningItem = items[winningSegmentIndex];
    
    const desiredBaseRotationForAlignment = -(winningSegmentIndex * segmentAngleDeg);

    let currentFullSpins = Math.floor(rotation.value / 360);
    // Para garantir que a nova rotação seja sempre maior e para frente
    if (rotation.value < 0 && (rotation.value % 360 !== 0) ) {
        currentFullSpins -=1; // Ajusta se a rotação normalizada for negativa
    }

    let finalTargetAngle = ((currentFullSpins + additionalRandomSpins) * 360) + desiredBaseRotationForAlignment;
    
    // Garante que a animação sempre gire para frente visualmente por pelo menos `minNewVisualSpins`
    const minNewVisualSpins = 2;
    while(finalTargetAngle <= rotation.value + 360 * (minNewVisualSpins - 0.5)) {
        finalTargetAngle += 360;
    }


    rotation.value = withTiming(
      finalTargetAngle,
      {
        duration: 4000,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(setSelectedItem)(winningItem);
          if (onSpinEnd) runOnJS(onSpinEnd)(winningItem);
          runOnJS(setIsSpinning)(false);
          
          rotation.value = finalTargetAngle % 360; // Normaliza para manter o estado da roleta
        } else {
          runOnJS(setIsSpinning)(false);
        }
      }
    );
  };
  return { rotation, selectedItem, isSpinning, spinWheelLogic };
}