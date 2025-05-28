// components/game/WheelGraphic.tsx
import {
  ITEM_CIRCLE_RADIUS,
  ITEMS_ORBIT_RADIUS, // Usaremos isso para calcular a posição
  WHEEL_SIZE
} from '@/constants/GameSettings';
import { Movie } from '@/constants/MovieData';
import React from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, G, Image as SvgImage } from 'react-native-svg';

interface WheelGraphicProps {
  rotation: Animated.SharedValue<number>;
  items: Movie[]; // Recebe a lista de itens (filmes)
}

export const WheelGraphic: React.FC<WheelGraphicProps> = ({ rotation, items }) => {
  const animatedWheelStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const numItems = items.length;
  if (numItems === 0) {
    return null; // Não renderiza nada se não houver itens
  }

  return (
    <Animated.View style={[{ width: WHEEL_SIZE, height: WHEEL_SIZE }, animatedWheelStyle]}>
      <Svg height={WHEEL_SIZE} width={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
        <Defs>
          {items.map((movie: Movie) => (
            <ClipPath key={`clip-${movie.id}`} id={`clipPath-${movie.id}`}>
              <Circle r={ITEM_CIRCLE_RADIUS} cx={0} cy={0} />
            </ClipPath>
          ))}
        </Defs>
        <G x={WHEEL_SIZE / 2} y={WHEEL_SIZE / 2}>
          <Circle r={WHEEL_SIZE / 2 - 5} fill="hsl(210, 30%, 90%)" stroke="hsl(210, 50%, 70%)" strokeWidth="2" />

          {items.map((movie: Movie, index) => {
            // Calcula o ângulo para cada item
            // O primeiro item (index 0) será posicionado no topo (antes de qualquer rotação da roda)
            const itemAngleRad = index * (2 * Math.PI / numItems) - (Math.PI / 2);
            const itemCenterX = ITEMS_ORBIT_RADIUS * Math.cos(itemAngleRad);
            const itemCenterY = ITEMS_ORBIT_RADIUS * Math.sin(itemAngleRad);

            return (
              <G key={`item-${movie.id}`} x={itemCenterX} y={itemCenterY}>
                <Circle // Círculo de borda/fundo para a imagem
                  r={ITEM_CIRCLE_RADIUS}
                  fill="hsl(210, 80%, 70%)" // Cor de fundo caso a imagem não carregue/seja menor
                  stroke="hsl(210, 90%, 40%)"
                  strokeWidth="2"
                />
                <SvgImage
                  x={-ITEM_CIRCLE_RADIUS}
                  y={-ITEM_CIRCLE_RADIUS}
                  width={ITEM_CIRCLE_RADIUS * 2}
                  height={ITEM_CIRCLE_RADIUS * 2}
                  preserveAspectRatio="xMidYMid slice"
                  href={{ uri: movie.posterUrl }}
                  clipPath={`url(#clipPath-${movie.id})`}
                />
              </G>
            );
          })}
        </G>
      </Svg>
    </Animated.View>
  );
};