// hooks/useWheelGame.ts
// Não mais importa ITEMS_ON_WHEEL ou SEGMENT_ANGLE_DEG daqui, pois serão baseados nos 'items' passados.
import { Movie } from '@/constants/MovieData';
import { useState } from 'react';
import { Easing, runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';

export interface UseWheelGameParams {
  items: Movie[]; // Agora recebe uma lista de filmes (ou qualquer item)
  onSpinEnd?: (result: Movie) => void;
}

export function useWheelGame({ items, onSpinEnd }: UseWheelGameParams) {
  const [selectedItem, setSelectedItem] = useState<Movie | null>(null); // Mudou para selectedItem
  const rotation = useSharedValue(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinWheelLogic = () => {
    if (isSpinning || !items || items.length === 0) return; // Não gira se não houver itens
    setIsSpinning(true);
    setSelectedItem(null);

    const numItems = items.length;
    const segmentAngleDeg = 360 / numItems; // Calculado dinamicamente

    const additionalRandomSpins = Math.floor(Math.random() * 2) + 3;
    const winningSegmentIndex = Math.floor(Math.random() * numItems);
    const winningItem = items[winningSegmentIndex];

    // Ajuste para centralizar o ponteiro no meio do segmento
    // O ângulo do centro do segmento é (índice * ânguloDoSegmento) + (ânguloDoSegmento / 2)
    // Mas para alinhar com um ponteiro fixo no topo (0 graus), queremos que o *início* do segmento vencedor
    // ou o seu centro, vá para a posição do ponteiro.
    // Se o ponteiro está no topo (0 graus), e 0 graus na roda é o início do primeiro segmento (índice 0),
    // queremos que o centro do segmento vencedor `winningSegmentIndex` chegue a 0 graus.
    // O ângulo do *início* do segmento `i` é `i * segmentAngleDeg`.
    // O ângulo do *centro* do segmento `i` é `i * segmentAngleDeg + segmentAngleDeg / 2`.
    // Para alinhar o *centro* do segmento vencedor com o ponteiro no topo (0 graus virtual):
    const angleOfWinningSegmentCenterDeg = (winningSegmentIndex * segmentAngleDeg) + (segmentAngleDeg / 2);
    // Para alinhar o *início* do segmento vencedor com o ponteiro (se o ponteiro aponta para o início):
    // const angleOfWinningSegmentStartDeg = winningSegmentIndex * segmentAngleDeg;

    // Vamos alinhar o CENTRO do círculo do item com o ponteiro.
    // O cálculo original que fiz para alinhar o centro do *setor circular* que contém o item.
    // O ângulo de cada item (considerando que o primeiro item está centrado em 0 graus após rotação inicial)
    // é winningSegmentIndex * segmentAngleDeg.
    // A lógica anterior já considerava o centro do *item* quando o primeiro item era alinhado com o topo.
    const desiredBaseRotationForAlignment = -(winningSegmentIndex * segmentAngleDeg);


    let numTotalSpinsForCalculation = Math.floor(rotation.value / 360) + additionalRandomSpins;
    let finalTargetAngle = (numTotalSpinsForCalculation * 360) + desiredBaseRotationForAlignment;

    const minNewVisualSpins = 2; // Garante pelo menos X giros visuais
    // Ajusta finalTargetAngle para garantir giros visuais suficientes e que termine na posição correta.
    // O `rotation.value` pode ser negativo após normalizações.
    // Queremos que finalTargetAngle seja maior que o valor atual + alguns giros.
    while (finalTargetAngle <= rotation.value + 360 * (minNewVisualSpins - 0.5)) {
       numTotalSpinsForCalculation++; // Adiciona um giro completo
       finalTargetAngle = (numTotalSpinsForCalculation * 360) + desiredBaseRotationForAlignment;
    }
     // Se a rotação atual for muito negativa, o cálculo acima pode não adicionar giros suficientes
     // para que pareça que girou para frente. Uma forma de garantir é:
     const currentFullSpins = Math.floor(rotation.value / 360);
     finalTargetAngle = ((currentFullSpins + additionalRandomSpins) * 360) + desiredBaseRotationForAlignment;
     // Assegurar que o giro seja sempre "para frente" visualmente
     if (finalTargetAngle <= rotation.value) {
        finalTargetAngle += 360 * minNewVisualSpins;
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

          // Normaliza a rotação para o intervalo [0, 360) ou (-360, 0]
          // para evitar valores de rotação excessivamente grandes
          let normalizedEffectiveRotation = finalTargetAngle % 360;
          // Se a rotação alvo era para alinhar com o ponteiro no topo (0 graus),
          // e a base da roleta (item 0) está no topo,
          // a rotação normalizada deve refletir a posição final.
          // O valor de rotation.value deve ser a rotação efetiva para o estado de repouso.
          rotation.value = normalizedEffectiveRotation;

        } else {
          // A animação não terminou (ex: interrompida)
          runOnJS(setIsSpinning)(false);
        }
      }
    );
  };
  return { rotation, selectedItem, isSpinning, spinWheelLogic };
}