// hooks/useWheelGame.ts
import { NUMBERS_ON_WHEEL, SEGMENT_ANGLE_DEG } from '@/constants/GameSettings';
import { useState } from 'react';
import { Easing, runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';

export interface UseWheelGameParams {
  onSpinEnd?: (result: string | number) => void;
}

export function useWheelGame({ onSpinEnd }: UseWheelGameParams) {
  const [selectedNumber, setSelectedNumber] = useState<string | number | null>(null);
  const rotation = useSharedValue(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinWheelLogic = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedNumber(null);

    const additionalRandomSpins = Math.floor(Math.random() * 2) + 3;
    const winningSegmentIndex = Math.floor(Math.random() * NUMBERS_ON_WHEEL.length);
    const winningNumber = NUMBERS_ON_WHEEL[winningSegmentIndex];

    const angleOfWinningCircleCenterDeg = winningSegmentIndex * SEGMENT_ANGLE_DEG;
    const desiredBaseRotationForAlignment = -angleOfWinningCircleCenterDeg;

    let numTotalSpinsForCalculation = Math.floor(rotation.value / 360) + additionalRandomSpins;
    let finalTargetAngle = (numTotalSpinsForCalculation * 360) + desiredBaseRotationForAlignment;

    const minNewVisualSpins = 2;
    while (finalTargetAngle <= rotation.value + 360 * (minNewVisualSpins - 0.5)) {
      numTotalSpinsForCalculation++;
      finalTargetAngle = (numTotalSpinsForCalculation * 360) + desiredBaseRotationForAlignment;
    }

    rotation.value = withTiming(
      finalTargetAngle,
      {
        duration: 4000,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(setSelectedNumber)(winningNumber);
          if (onSpinEnd) runOnJS(onSpinEnd)(winningNumber);
          runOnJS(setIsSpinning)(false);
          
          let normalizedEffectiveRotation = finalTargetAngle % 360;
          if (normalizedEffectiveRotation < 0) {
            normalizedEffectiveRotation += 360;
          }
          rotation.value = normalizedEffectiveRotation;
        } else {
          runOnJS(setIsSpinning)(false);
        }
      }
    );
  };
  return { rotation, selectedNumber, isSpinning, spinWheelLogic };
}