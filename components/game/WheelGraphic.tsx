// components/game/WheelGraphic.tsx
import {
    ITEM_CIRCLE_RADIUS,
    ITEMS_ORBIT_RADIUS,
    NUMBERS_ON_WHEEL,
    WHEEL_SIZE
} from '@/constants/GameSettings';
import React from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

interface WheelGraphicProps {
  rotation: Animated.SharedValue<number>;
}

export const WheelGraphic: React.FC<WheelGraphicProps> = ({ rotation }) => {
  const animatedWheelStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View style={[{ width: WHEEL_SIZE, height: WHEEL_SIZE }, animatedWheelStyle]}>
      <Svg height={WHEEL_SIZE} width={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
        <G x={WHEEL_SIZE / 2} y={WHEEL_SIZE / 2}>
          <Circle r={WHEEL_SIZE / 2 - 5} fill="hsl(210, 30%, 90%)" stroke="hsl(210, 50%, 70%)" strokeWidth="2" />
          
          {NUMBERS_ON_WHEEL.map((number, index) => {
            const itemAngleRad = index * (2 * Math.PI / NUMBERS_ON_WHEEL.length) - (Math.PI / 2);
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
  );
};