// app/(tabs)/index.tsx
import { PointerIcon } from '@/components/game/PointerIcon'; //
import { WheelGraphic } from '@/components/game/WheelGraphic'; //
import { ThemedText } from '@/components/ThemedText'; //
import { ThemedView } from '@/components/ThemedView'; //
import { ThemedButton } from '@/components/ui/ThemedButton'; //
import { Colors } from '@/constants/Colors'; //
import { Movie } from '@/constants/MovieData'; //
import { useTheme } from '@/context/ThemeContext'; //
import { useWheelGame } from '@/hooks/useWheelGame'; //
import { useWheelItemsManager } from '@/hooks/useWheelItemsManager'; //
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { styles } from './styles/index.styles'; //

export default function HomeScreen() {
  const { theme } = useTheme(); //
  const {
    wheelMovies,
    addMovieToWheel,
    removeMovieById, // Nova função
    clearWheel,
    isLoadingItems,
    isSavingItems,
    isLoadingMovie,
    isRemovingMovie, // Novo estado
    errorLoadingItems,
    errorAddingMovie,
    errorRemovingMovie, // Novo estado
  } = useWheelItemsManager(); //

  const { rotation, selectedItem, isSpinning, spinWheelLogic } = useWheelGame({ //
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
    const addedMovie = await addMovieToWheel(movieTitleInput); //
    if (addedMovie) {
      setMovieTitleInput('');
    }
  };

  const handleRemoveMovie = (movieId: string, movieTitle: string) => {
    const confirmRemove = async () => {
      await removeMovieById(movieId); //
    };

    if (isSpinning || isRemovingMovie) return; // Não permitir remoção durante giro ou outra remoção

    if (Platform.OS === 'web') {
      if (window.confirm(`Remover "${movieTitle}" da roleta?`)) {
        confirmRemove();
      }
    } else {
      Alert.alert(
        "Remover Filme",
        `Tem certeza que deseja remover "${movieTitle}" da roleta?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Remover", style: "destructive", onPress: confirmRemove }
        ]
      );
    }
  };

  const handleClearWheel = async () => {
    // ... (lógica existente)
    const performClear = async () => {
      await clearWheel(); //
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Limpar Roleta?\nTem certeza que deseja remover todos os filmes da roleta?")) {
        performClear();
      }
    } else {
      Alert.alert(
        "Limpar Roleta",
        "Tem certeza que deseja remover todos os filmes da roleta?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Limpar", style: "destructive", onPress: performClear }
        ]
      );
    }
  };


  if (isLoadingItems) {
    // ... (loading state existente)
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors[theme].tint} />
        <ThemedText type="default" style={styles.loadingText}>Carregando sua roleta...</ThemedText>
      </ThemedView>
    );
  }

  if (errorLoadingItems) {
    // ... (error state existente)
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center' }]}>
        <ThemedText type="default" style={[styles.errorText, theme === 'dark' && { color: Colors.dark.text } ]}>
            Erro ao carregar dados: {errorLoadingItems.message}
        </ThemedText>
      </ThemedView>
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
            <WheelGraphic
              rotation={rotation}
              items={wheelMovies}
              onItemPress={(movieId) => { // Passar a função de callback
                const moviePressed = wheelMovies.find(m => m.id === movieId);
                if (moviePressed) {
                  handleRemoveMovie(movieId, moviePressed.title);
                }
              }}
            />
          </View>
        </View>
        <ThemedButton
          title={isSpinning ? 'Girando...' : (isRemovingMovie ? 'Removendo...' : 'Girar a Roleta!')}
          onPress={spinWheelLogic}
          disabled={isSpinning || wheelMovies.length < 2 || isSavingItems || isRemovingMovie}
          isLoading={isSpinning}
          colorType="primary"
          style={styles.actionButtonContainer}
        />
        {selectedItem && (
          <ThemedText type="subtitle" style={styles.resultText}>
            Sorteado: {selectedItem.title}
          </ThemedText>
        )}
      </>
    );
  } else if (!isLoadingMovie && !isSavingItems && !isRemovingMovie) { // Adicionado isRemovingMovie
    wheelSection = (
      <ThemedText type="default" style={styles.emptyWheelText}>
        Adicione filmes à roleta para começar!
      </ThemedText>
    );
  } else {
    wheelSection = null; // Ou um indicador de loading se isRemovingMovie for true e wheelMovies.length for 0
  }
  

  return (
    <ScrollView
        contentContainerStyle={[styles.scrollContainer, { backgroundColor: Colors[theme].background }]} //
        keyboardShouldPersistTaps="handled"
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={[styles.pageTitle]}>Roleta de Filmes Personalizada</ThemedText>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: Colors[theme].tint,
                color: Colors[theme].text,
                backgroundColor: theme === 'light' ? '#FFFFFF' : '#3C3C3D',
                fontFamily: 'GlassAntiqua-Inline',
              }
            ]}
            placeholder="Digite o título do filme"
            placeholderTextColor={Colors[theme].icon}
            value={movieTitleInput}
            onChangeText={setMovieTitleInput}
            onSubmitEditing={handleAddMovie}
            editable={!isSavingItems && !isLoadingMovie && !isRemovingMovie} // Adicionado isRemovingMovie
          />
          <ThemedButton
            title={isLoadingMovie ? 'Buscando...' : (isSavingItems ? 'Salvando...' : (isRemovingMovie ? 'Removendo...' : 'Adicionar Filme'))}
            onPress={handleAddMovie}
            disabled={isLoadingMovie || isSavingItems || isRemovingMovie} // Adicionado isRemovingMovie
            isLoading={isLoadingMovie}
            colorType="primary"
          />
        </View>

        {errorAddingMovie && (
           <ThemedText type="default" style={[styles.errorText, theme === 'dark' && { color: Colors.dark.text } ]}>
            {errorAddingMovie.message}
          </ThemedText>
        )}
        {errorRemovingMovie && ( // Feedback para erro de remoção
           <ThemedText type="default" style={[styles.errorText, { color: theme === 'dark' ? Colors.dark.text : 'red' } ]}>
            {errorRemovingMovie.message}
          </ThemedText>
        )}

        {(isSavingItems || isRemovingMovie) && !isLoadingMovie && ( // Reutilizar ou criar um texto de "Atualizando..."
            <ThemedText type="default" style={styles.loadingText}>
              {isRemovingMovie ? 'Removendo filme...' : 'Salvando alterações...'}
            </ThemedText>
        )}


        {isLoadingMovie && wheelMovies.length === 0 && (
            // ... (loading state existente)
            <ThemedView style={[styles.loadingContainer, {backgroundColor: 'transparent'}]}>
                <ActivityIndicator size="small" color={Colors[theme].tint} />
                <ThemedText type="default" style={styles.loadingText}>Buscando seu filme...</ThemedText>
            </ThemedView>
        )}

        {wheelSection}

        {wheelMovies.length > 0 && !isRemovingMovie && ( // Esconder botão de limpar se estiver removendo
          <View style={styles.clearButtonContainer}>
            <ThemedButton
                title={isSavingItems ? "Limpando..." : "Limpar Roleta"}
                onPress={handleClearWheel}
                disabled={isSavingItems || isSpinning}
                isLoading={isSavingItems && wheelMovies.length > 0 && !isRemovingMovie} // Ajustar condição
                colorType="destructive"
            />
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}