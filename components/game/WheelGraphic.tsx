// components/game/WheelGraphic.tsx
import {
  ITEM_CIRCLE_RADIUS,
  ITEMS_ORBIT_RADIUS,
  WHEEL_SIZE
} from '@/constants/GameSettings';
import { Movie } from '@/constants/MovieData';
import { Image as ExpoImage } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native'; // View é usado no contêiner principal
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';

interface WheelGraphicProps {
  rotation: SharedValue<number>; // Usando SharedValue diretamente
  items: Movie[];
}

interface WheelItemProps {
  movie: Movie;
  index: number;
  totalItems: number;
  wheelRotationValue: SharedValue<number>; // Passa a SharedValue da rotação da roleta
}

// Componente para cada item individual da roleta
const WheelItem: React.FC<WheelItemProps> = ({ movie, index, totalItems, wheelRotationValue }) => {
  // Calcular a posição estática do item na órbita
  // O centro da roleta é (WHEEL_SIZE / 2, WHEEL_SIZE / 2)
  // O primeiro item (index 0) é posicionado no topo (-90 graus ou -PI/2 radianos)
  const angleRad = index * (2 * Math.PI / totalItems) - (Math.PI / 2);
  const circleCenterX = WHEEL_SIZE / 2 + ITEMS_ORBIT_RADIUS * Math.cos(angleRad);
  const circleCenterY = WHEEL_SIZE / 2 + ITEMS_ORBIT_RADIUS * Math.sin(angleRad);

  // Estilo animado para aplicar a contra-rotação ao item
  const itemAnimatedStyle = useAnimatedStyle(() => {
    return {
      // Rotaciona o item no sentido oposto da roleta para mantê-lo "de pé"
      // em relação à tela.
      transform: [{ rotate: `${-wheelRotationValue.value}deg` }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.itemOuterContainer, // Contêiner para posicionamento e rotação de contra-ataque
        {
          // Posiciona o centro do itemOuterContainer no local calculado na órbita
          left: circleCenterX - ITEM_CIRCLE_RADIUS, // Ajusta para que o centro do círculo do item esteja em (circleCenterX, circleCenterY)
          top: circleCenterY - ITEM_CIRCLE_RADIUS,
          // A rotação de posicionamento na órbita é feita pela View pai (animatedWheelBaseStyle)
        },
        itemAnimatedStyle, // Aplica a contra-rotação dinâmica
      ]}
    >
      {/* View interna para o conteúdo visual do item (imagem e borda) */}
      {/* Esta View não precisa de rotação própria, pois o pai já cuida disso */}
      <View style={styles.itemInnerContainer}>
        <ExpoImage
          source={{ uri: movie.posterUrl }}
          style={styles.itemImage}
          contentFit="cover" // ou "contain" dependendo do efeito desejado
          transition={150}
          placeholderContentFit="cover" // Para o placeholder, se usado
          // accessibilityLabel={`Pôster do filme ${movie.title}`}
        />
      </View>
    </Animated.View>
  );
};

export const WheelGraphic: React.FC<WheelGraphicProps> = ({ rotation, items }) => {
  // Estilo animado para girar a base da roleta E todos os itens juntos
  const animatedWheelBaseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const numItems = items.length;

  // Não renderiza nada se não houver itens, ou se o WHEEL_SIZE for 0
  if (numItems === 0 || WHEEL_SIZE <= 0) {
    return null;
  }

  return (
    <View style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
      {/* Contêiner base que aplica a rotação principal a todos os seus filhos */}
      <Animated.View style={[{ width: WHEEL_SIZE, height: WHEEL_SIZE, position: 'absolute' }, animatedWheelBaseStyle]}>
        {/* SVG apenas para o círculo de fundo da roleta */}
        <Svg height={WHEEL_SIZE} width={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
          <G x={WHEEL_SIZE / 2} y={WHEEL_SIZE / 2}>
            <Circle
                r={WHEEL_SIZE / 2 - 5} // Raio ligeiramente menor para a borda
                fill="hsl(210, 30%, 90%)"
                stroke="hsl(210, 50%, 70%)"
                strokeWidth="2"
            />
          </G>
        </Svg>

        {/* Renderiza cada item como um componente React Native posicionado e contra-rotacionado */}
        {/* Os itens também são filhos do Animated.View que gira, então eles seguem a rotação da roda,
            mas o WheelItem individualmente se contra-rotaciona para ficar de pé.
        */}
        {items.map((movie, index) => (
          <WheelItem
            key={`movie-item-${movie.id}`}
            movie={movie}
            index={index}
            totalItems={numItems}
            wheelRotationValue={rotation} // Passa a shared value da rotação da roleta
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemOuterContainer: {
    width: ITEM_CIRCLE_RADIUS * 2,
    height: ITEM_CIRCLE_RADIUS * 2,
    position: 'absolute', // Crucial para posicionamento sobre o SVG
    // O centro deste contêiner será posicionado em (circleCenterX, circleCenterY)
    // Não definir borderRadius ou overflow aqui, pois a rotação pode cortar.
    // backgroundColor: 'rgba(0, 255, 0, 0.3)', // Para debug de posicionamento e rotação
  },
  itemInnerContainer: {
    width: '100%',
    height: '100%',
    borderRadius: ITEM_CIRCLE_RADIUS, // Aplica o formato circular ao conteúdo visual
    overflow: 'hidden', // Garante que a imagem fique dentro do círculo
    backgroundColor: 'hsl(210, 80%, 70%)', // Cor de fundo para o item, visível se a imagem não carregar
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, // Adiciona uma borda ao círculo do item
    borderColor: 'hsl(210, 90%, 40%)',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
});