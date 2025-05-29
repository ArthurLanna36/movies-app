// components/game/WheelGraphic.tsx
import {
  ITEM_CIRCLE_RADIUS,
  ITEMS_ORBIT_RADIUS,
  WHEEL_SIZE
} from '@/constants/GameSettings'; //
import { Movie } from '@/constants/MovieData'; //
import { Image as ExpoImage } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native'; // Adicionar TouchableOpacity e Alert
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';

interface WheelGraphicProps {
  rotation: SharedValue<number>;
  items: Movie[];
  onItemPress?: (movieId: string) => void; // Nova prop para o clique no item
}

interface WheelItemProps {
  movie: Movie;
  index: number;
  totalItems: number;
  wheelRotationValue: SharedValue<number>;
  onPress?: (movieId: string) => void; // Nova prop
}

const WheelItem: React.FC<WheelItemProps> = ({ movie, index, totalItems, wheelRotationValue, onPress }) => {
  const angleRad = index * (2 * Math.PI / totalItems) - (Math.PI / 2);
  const circleCenterX = WHEEL_SIZE / 2 + ITEMS_ORBIT_RADIUS * Math.cos(angleRad);
  const circleCenterY = WHEEL_SIZE / 2 + ITEMS_ORBIT_RADIUS * Math.sin(angleRad);

  const itemAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${-wheelRotationValue.value}deg` }],
    };
  });

  const handlePress = () => {
    if (onPress) {
      onPress(movie.id);
    }
  };

  return (
    <Animated.View
      style={[
        styles.itemOuterContainer,
        {
          left: circleCenterX - ITEM_CIRCLE_RADIUS,
          top: circleCenterY - ITEM_CIRCLE_RADIUS,
        },
        itemAnimatedStyle,
      ]}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <View style={styles.itemInnerContainer}>
          <ExpoImage
            source={{ uri: movie.posterUrl }}
            style={styles.itemImage}
            contentFit="cover"
            transition={150}
            placeholderContentFit="cover"
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const WheelGraphic: React.FC<WheelGraphicProps> = ({ rotation, items, onItemPress }) => {
  const animatedWheelBaseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const numItems = items.length;

  if (numItems === 0 || WHEEL_SIZE <= 0) {
    return null;
  }

  return (
    <View style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
      <Animated.View style={[{ width: WHEEL_SIZE, height: WHEEL_SIZE, position: 'absolute' }, animatedWheelBaseStyle]}>
        <Svg height={WHEEL_SIZE} width={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
          <G x={WHEEL_SIZE / 2} y={WHEEL_SIZE / 2}>
            <Circle
                r={WHEEL_SIZE / 2 - 5}
                fill="hsl(210, 30%, 90%)" // Cor de exemplo, idealmente do tema
                stroke="hsl(210, 50%, 70%)" // Cor de exemplo
                strokeWidth="2"
            />
          </G>
        </Svg>
        {items.map((movie, index) => (
          <WheelItem
            key={`movie-item-${movie.id}-${index}`} // Adicionar index para garantir chave única se IDs puderem repetir (embora não devam)
            movie={movie}
            index={index}
            totalItems={numItems}
            wheelRotationValue={rotation}
            onPress={onItemPress} // Passar a função de callback
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
    position: 'absolute',
  },
  itemInnerContainer: {
    width: '100%',
    height: '100%',
    borderRadius: ITEM_CIRCLE_RADIUS,
    overflow: 'hidden',
    backgroundColor: 'hsl(210, 80%, 70%)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'hsl(210, 90%, 40%)',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
});