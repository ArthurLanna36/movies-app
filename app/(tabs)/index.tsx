import { FontAwesome } from '@expo/vector-icons'; // Alterado para FontAwesome
import { useState } from 'react';
import { Button, Text as RNText, StyleSheet, View } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

const WHEEL_SIZE = 325; 
const NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1); 
const SEGMENT_ANGLE_DEG = 360 / NUMBERS.length; 
const ITEM_CIRCLE_RADIUS = 30; // Mantido em 30
const ITEMS_ORBIT_RADIUS = WHEEL_SIZE / 2 - ITEM_CIRCLE_RADIUS - 25; 


export default function HomeScreen() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const rotation = useSharedValue(0); 
  const [isSpinning, setIsSpinning] = useState(false);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedNumber(null); 

    const additionalRandomSpins = Math.floor(Math.random() * 2) + 3; 
    const winningSegmentIndex = Math.floor(Math.random() * NUMBERS.length); 
    const winningNumber = NUMBERS[winningSegmentIndex];
    
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

  const animatedWheelStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <RNText style={styles.pageTitle}>Roleta Numérica</RNText>

      <View style={styles.wheelArea}>
        <View style={styles.pointerContainer}>
          {/* Usando FontAwesome no lugar de BiSolidDownArrow */}
          <FontAwesome name="caret-down" size={40} color="#000000" /> 
        </View>
        
        <Animated.View style={[styles.wheelGraphicContainer, animatedWheelStyle]}>
          <Svg height={WHEEL_SIZE} width={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
            <G x={WHEEL_SIZE / 2} y={WHEEL_SIZE / 2}>
              <Circle r={WHEEL_SIZE / 2 - 5} fill="hsl(210, 30%, 90%)" stroke="hsl(210, 50%, 70%)" strokeWidth="2" />
              
              {NUMBERS.map((number, index) => {
                const itemAngleRad = index * (2 * Math.PI / NUMBERS.length) - (Math.PI / 2);
                const itemCenterX = ITEMS_ORBIT_RADIUS * Math.cos(itemAngleRad);
                const itemCenterY = ITEMS_ORBIT_RADIUS * Math.sin(itemAngleRad);

                return (
                  <G key={`item-circle-${number}`} x={itemCenterX} y={itemCenterY}>
                    <Circle 
                      r={ITEM_CIRCLE_RADIUS} 
                      fill="hsl(210, 80%, 70%)" 
                      stroke="hsl(210, 90%, 40%)"
                      strokeWidth="2"
                    />
                    <SvgText
                      x={0} 
                      y={0} 
                      fontSize={Math.max(12, ITEM_CIRCLE_RADIUS * 0.55)} 
                      fontWeight="bold"
                      fill="#fff"
                      textAnchor="middle"
                      alignmentBaseline="central"
                      transform={`rotate(${(itemAngleRad + Math.PI / 2) * (180 / Math.PI)})`}
                    >
                      {number}
                    </SvgText>
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>
      </View>

      <Button
        title={isSpinning ? "Girando..." : "Girar a Roleta"}
        onPress={spinWheel}
        disabled={isSpinning}
        color="hsl(210, 90%, 50%)"
      />
      {selectedNumber !== null && (
        <RNText style={styles.resultText}>Número Sorteado: {selectedNumber}</RNText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F2F7', 
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0D47A1', 
    marginBottom: 40,
  },
  wheelArea: {
    width: WHEEL_SIZE, 
    height: WHEEL_SIZE + 30, 
    alignItems: 'center',
    justifyContent: 'flex-start', 
    position: 'relative',
    marginBottom: 40,
  },
  pointerContainer: { 
    position: 'absolute',
    top: 0, // Ajuste fino da posição vertical do ponteiro, se necessário
    zIndex: 1, 
    alignSelf: 'center',
  },
  wheelGraphicContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    position: 'absolute',
    top: 30, // Garante espaço para o ponteiro acima da roleta
  },
  resultText: {
    fontSize: 24,
    color: '#2E7D32', 
    marginTop: 30,
    fontWeight: 'bold',
  },
});