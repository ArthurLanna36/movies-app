// app/(tabs)/index.tsx
import { PointerIcon } from '@/components/game/PointerIcon';
import { WheelGraphic } from '@/components/game/WheelGraphic';
import { WHEEL_SIZE } from '@/constants/GameSettings';
import { Movie } from '@/constants/MovieData';
import { useMovieData } from '@/hooks/useMovieData';
import { useWheelGame } from '@/hooks/useWheelGame';
import { ActivityIndicator, Button, Text as RNText, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { movies, isLoading: isLoadingMovies, error: movieError, loadMovies } = useMovieData();

  const { rotation, selectedItem, isSpinning, spinWheelLogic } = useWheelGame({
    items: movies, // Passa os filmes carregados para o hook da roleta
    onSpinEnd: (movie: Movie) => {
      console.log("Roleta parou em:", movie.title);
      // Você pode, por exemplo, navegar para uma tela de detalhes do filme aqui
      // ou mostrar um modal com mais informações sobre 'movie'.
    }
  });

  if (isLoadingMovies && movies.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0D47A1" />
        <RNText style={styles.loadingText}>Carregando filmes para a roleta...</RNText>
      </View>
    );
  }

  if (movieError) {
    return (
      <View style={styles.container}>
        <RNText style={styles.errorText}>Erro ao carregar filmes: {movieError.message}</RNText>
        <Button title="Tentar Novamente" onPress={() => loadMovies()} color="#D32F2F" />
      </View>
    );
  }

  if (movies.length === 0 && !isLoadingMovies) {
    return (
      <View style={styles.container}>
        <RNText style={styles.pageTitle}>Sem filmes para a roleta!</RNText>
        <Button title="Carregar Filmes" onPress={() => loadMovies(1)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RNText style={styles.pageTitle}>Roleta de Filmes</RNText>
      <View style={styles.wheelArea}>
        <View style={styles.pointerContainer}>
          <PointerIcon />
        </View>
        <View style={styles.wheelGraphicContainer}>
          {/* Passa os filmes para o WheelGraphic */}
          <WheelGraphic rotation={rotation} items={movies} />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={isSpinning ? "Girando..." : "Girar a Roleta!"}
          onPress={spinWheelLogic}
          disabled={isSpinning || movies.length === 0}
          color="hsl(210, 90%, 50%)"
        />
      </View>
      {selectedItem && (
        <RNText style={styles.resultText}>Filme Sorteado: {selectedItem.title}</RNText>
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
    padding: 20,
  },
  pageTitle: {
    fontSize: 28, // Ligeiramente menor para acomodar mais conteúdo se necessário
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 30,
    textAlign: 'center',
  },
  wheelArea: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE + 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    marginBottom: 30,
  },
  pointerContainer: {
    position: 'absolute',
    top: 0, // Ajuste fino da posição do ponteiro pode ser necessário
    zIndex: 10, // Para garantir que fique sobre a roleta
    alignSelf: 'center',
  },
  wheelGraphicContainer: {
    position: 'absolute',
    top: 30, // Deslocamento para dar espaço ao ponteiro
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
  resultText: {
    fontSize: 22,
    color: '#2E7D32',
    marginTop: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0D47A1',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
});