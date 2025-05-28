// app/(tabs)/index.tsx
import { PointerIcon } from '@/components/game/PointerIcon';
import { WheelGraphic } from '@/components/game/WheelGraphic';
// WHEEL_SIZE não é mais importado aqui, a menos que seja usado na lógica do componente,
// mas no nosso caso, era usado apenas para os estilos.
// import { WHEEL_SIZE } from '@/constants/GameSettings';
import { Movie } from '@/constants/MovieData';
import { useWheelGame } from '@/hooks/useWheelGame';
import { useWheelItemsManager } from '@/hooks/useWheelItemsManager';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  // StyleSheet, // Removido, pois os estilos vêm de outro arquivo
  Text as RNText,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { styles } from './index.styles'; // Importa os estilos do novo arquivo

export default function HomeScreen() {
  const {
    wheelMovies,
    addMovieToWheel,
    clearWheel,
    isLoadingItems,
    isSavingItems,
    isLoadingMovie,
    errorLoadingItems,
    errorAddingMovie,
  } = useWheelItemsManager();

  const { rotation, selectedItem, isSpinning, spinWheelLogic } = useWheelGame({
    items: wheelMovies,
    onSpinEnd: (movie: Movie) => {
      console.log('Roleta parou em:', movie.title);
      Alert.alert(
        'Filme Sorteado!',
        `${movie.title}${movie.overview ? `\n\nSinopse: ${movie.overview.substring(0, 100)}...` : ''}`
      );
    },
  });

  const [movieTitleInput, setMovieTitleInput] = useState('');

  const handleAddMovie = async () => {
    if (!movieTitleInput.trim()) {
      Alert.alert('Erro', 'Por favor, digite o título de um filme.');
      return;
    }
    const addedMovie = await addMovieToWheel(movieTitleInput);
    if (addedMovie) {
      setMovieTitleInput('');
    }
  };

  const handleClearWheel = async () => {
    Alert.alert(
      "Limpar Roleta",
      "Tem certeza que deseja remover todos os filmes da roleta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Limpar", style: "destructive", onPress: async () => {
            await clearWheel();
        }}
      ]
    );
  };

  if (isLoadingItems) {
    return (
      <View style={styles.container}> {/* Usando styles.container importado */}
        <ActivityIndicator size="large" color="#0D47A1" />
        <RNText style={styles.loadingText}>Carregando sua roleta...</RNText>
      </View>
    );
  }

  if (errorLoadingItems) {
     return (
      <View style={styles.container}>
        <RNText style={styles.errorText}>Erro ao carregar dados: {errorLoadingItems.message}</RNText>
      </View>
    );
  }

  let wheelSection;
  if (wheelMovies.length > 0) {
    wheelSection = (
      <>
        <View style={styles.wheelArea}>
          <View style={styles.pointerContainer}>
            <PointerIcon />
          </View>
          <View style={styles.wheelGraphicContainer}>
            <WheelGraphic rotation={rotation} items={wheelMovies} />
          </View>
        </View>
        <View style={styles.actionButtonContainer}>
          <Button
            title={isSpinning ? 'Girando...' : 'Girar a Roleta!'}
            onPress={spinWheelLogic}
            disabled={isSpinning || wheelMovies.length < 2 || isSavingItems}
            color="hsl(210, 90%, 50%)"
          />
        </View>
        {selectedItem && (
          <RNText style={styles.resultText}>
            Sorteado: {selectedItem.title}
          </RNText>
        )}
      </>
    );
  } else if (!isLoadingMovie && !isSavingItems) {
    wheelSection = (
      <RNText style={styles.emptyWheelText}>
        Adicione filmes à roleta para começar!
      </RNText>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <RNText style={styles.pageTitle}>Roleta de Filmes Personalizada</RNText>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Digite o título do filme"
            value={movieTitleInput}
            onChangeText={setMovieTitleInput}
            onSubmitEditing={handleAddMovie}
            editable={!isSavingItems}
          />
          <Button
            title={isLoadingMovie ? 'Buscando...' : (isSavingItems ? 'Salvando...' : 'Adicionar Filme')}
            onPress={handleAddMovie}
            disabled={isLoadingMovie || isSavingItems}
          />
        </View>
        {errorAddingMovie && (
          <RNText style={styles.errorText}>{errorAddingMovie.message}</RNText>
        )}
        {isSavingItems && <RNText style={styles.loadingText}>Salvando alterações...</RNText>}

        {isLoadingMovie && wheelMovies.length === 0 && (
             <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0D47A1" />
                <RNText style={styles.loadingText}>Buscando seu filme...</RNText>
            </View>
        )}

        {wheelSection}

        {wheelMovies.length > 0 && (
          <View style={styles.clearButtonContainer}>
            <Button
                title={isSavingItems ? "Limpando..." : "Limpar Roleta"}
                onPress={handleClearWheel}
                color="#ff6666"
                disabled={isSavingItems}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// O objeto StyleSheet.create foi movido para ./index.styles.ts