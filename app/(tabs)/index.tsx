// app/(tabs)/index.tsx
import { PointerIcon } from '@/components/game/PointerIcon';
import { WheelGraphic } from '@/components/game/WheelGraphic';
import { WHEEL_SIZE } from '@/constants/GameSettings';
import { useWheelGame } from '@/hooks/useWheelGame';
import { Button, Text as RNText, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { rotation, selectedNumber, isSpinning, spinWheelLogic } = useWheelGame({
     onSpinEnd: (result) => {
       console.log("Roleta parou em:", result);
     }
  });

  return (
    <View style={styles.container}>
      <RNText style={styles.pageTitle}>Roleta Numérica</RNText>
      <View style={styles.wheelArea}>
        <View style={styles.pointerContainer}>
          <PointerIcon />
        </View>
        <View style={styles.wheelGraphicContainer}> 
          {/* Container adicional para aplicar o top offset para o WheelGraphic */}
          <WheelGraphic rotation={rotation} />
        </View>
      </View>
      <Button
        title={isSpinning ? "Girando..." : "Girar a Roleta"}
        onPress={spinWheelLogic}
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
    height: WHEEL_SIZE + 30, // Espaço para o ponteiro
    alignItems: 'center',
    justifyContent: 'flex-start', 
    position: 'relative',
    marginBottom: 40,
  },
  pointerContainer: { 
    position: 'absolute',
    top: 0, 
    zIndex: 1, 
    alignSelf: 'center',
  },
  wheelGraphicContainer: { // Este container aplica o offset para o WheelGraphic
    position: 'absolute',
    top: 30, // Desloca a roleta para baixo para dar espaço ao ponteiro
    // Não precisa de width/height aqui, pois WheelGraphic já tem
  },
  resultText: {
    fontSize: 24,
    color: '#2E7D32', 
    marginTop: 30,
    fontWeight: 'bold',
  },
});