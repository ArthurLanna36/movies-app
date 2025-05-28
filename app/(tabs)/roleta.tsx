import { PointerIcon } from '@/components/game/PointerIcon';
import { WheelGraphic } from '@/components/game/WheelGraphic';
import { Movie } from '@/constants/MovieData';
import { useWheelGame } from '@/hooks/useWheelGame';
import { useWheelItemsManager } from '@/hooks/useWheelItemsManager';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { styles } from './styles/roleta.styles';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
  const { theme } = useTheme();
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
    const performClear = async () => {
      console.log("Ação de limpar confirmada.");
      await clearWheel();
      console.log("Função clearWheel (do hook) concluída.");
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Limpar Roleta?\nTem certeza que deseja remover todos os filmes da roleta?")) {
        performClear();
      } else {
        console.log("Limpeza cancelada pelo usuário na web.");
      }
    } else {
      Alert.alert(
        "Limpar Roleta",
        "Tem certeza que deseja remover todos os filmes da roleta?",
        [
          { text: "Cancelar", style: "cancel", onPress: () => console.log("Limpeza cancelada pelo usuário.") },
          { text: "Limpar", style: "destructive", onPress: performClear }
        ]
      );
    }
  };

  if (isLoadingItems) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={Colors[theme].tint} />
        <ThemedText type="default" style={styles.loadingText}>Carregando sua roleta...</ThemedText>
      </ThemedView>
    );
  }

  if (errorLoadingItems) {
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
            <WheelGraphic rotation={rotation} items={wheelMovies} />
          </View>
        </View>
        <ThemedButton
          title={isSpinning ? 'Girando...' : 'Girar a Roleta!'}
          onPress={spinWheelLogic}
          disabled={isSpinning || wheelMovies.length < 2 || isSavingItems}
          isLoading={isSpinning}
          colorType="primary"
          style={styles.actionButtonContainer} // Mantém o estilo de layout
        />
        {selectedItem && (
          <ThemedText type="subtitle" style={styles.resultText}>
            Sorteado: {selectedItem.title}
          </ThemedText>
        )}
      </>
    );
  } else if (!isLoadingMovie && !isSavingItems) {
    wheelSection = (
      <ThemedText type="default" style={styles.emptyWheelText}>
        Adicione filmes à roleta para começar!
      </ThemedText>
    );
  } else {
    wheelSection = null;
  }

  return (
    <ScrollView
        contentContainerStyle={[styles.scrollContainer, { backgroundColor: Colors[theme].background }]}
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
                fontFamily: 'GlassAntiqua-Inline', // Aplicando a fonte aqui também
              }
            ]}
            placeholder="Digite o título do filme"
            placeholderTextColor={Colors[theme].icon}
            value={movieTitleInput}
            onChangeText={setMovieTitleInput}
            onSubmitEditing={handleAddMovie}
            editable={!isSavingItems}
          />
          <ThemedButton
            title={isLoadingMovie ? 'Buscando...' : (isSavingItems ? 'Salvando...' : 'Adicionar Filme')}
            onPress={handleAddMovie}
            disabled={isLoadingMovie || isSavingItems}
            isLoading={isLoadingMovie}
            colorType="primary"
          />
        </View>

        {errorAddingMovie && (
           <ThemedText type="default" style={[styles.errorText, theme === 'dark' && { color: Colors.dark.text } ]}>
            {errorAddingMovie.message}
          </ThemedText>
        )}
        {isSavingItems && <ThemedText type="default" style={styles.loadingText}>Salvando alterações...</ThemedText>}

        {isLoadingMovie && wheelMovies.length === 0 && (
             <ThemedView style={[styles.loadingContainer, {backgroundColor: 'transparent'}]}>
                <ActivityIndicator size="small" color={Colors[theme].tint} />
                <ThemedText type="default" style={styles.loadingText}>Buscando seu filme...</ThemedText>
            </ThemedView>
        )}

        {wheelSection}

        {wheelMovies.length > 0 && (
          <View style={styles.clearButtonContainer}>
            <ThemedButton
                title={isSavingItems ? "Limpando..." : "Limpar Roleta"}
                onPress={handleClearWheel}
                disabled={isSavingItems}
                isLoading={isSavingItems && wheelMovies.length > 0}
                colorType="destructive"
            />
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}