// app/(tabs)/watched.tsx
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Movie } from "@/constants/MovieData";
import { useWatchedMoviesManager } from "@/hooks/useWatchedMoviesManager"; // Importar o novo hook
import { Image as ExpoImage } from "expo-image";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView, // Para o caso de muitos filmes e o input não caber
  TextInput,
  TouchableOpacity, // Se não for usar PaperButton para o item
  View,
} from "react-native";
import {
  Dialog,
  Button as PaperButton,
  Text as PaperText,
  Portal,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { styles } from "./styles/watched.styles"; // Importar os novos estilos

export default function WatchedScreen() {
  const paperTheme = usePaperTheme();
  const {
    watchedMovies,
    addMovieToWatchedList,
    isLoading,
    isAdding,
    error,
    clearError,
  } = useWatchedMoviesManager();

  const [movieTitleInput, setMovieTitleInput] = useState("");
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);

  React.useEffect(() => {
    if (error) {
      setErrorDialogVisible(true);
    }
  }, [error]);

  const handleAddMovie = async () => {
    if (!movieTitleInput.trim()) {
      // Pode mostrar um erro direto ou usar o dialog
      return;
    }
    const added = await addMovieToWatchedList(movieTitleInput);
    if (added) {
      setMovieTitleInput(""); // Limpa o input se o filme foi adicionado (ou se a busca foi bem sucedida)
    }
  };

  const hideErrorDialog = () => {
    setErrorDialogVisible(false);
    clearError(); // Limpa o erro no hook
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieItemContainer}
      onPress={() => {
        // Poderia abrir um modal com detalhes do filme ou opção de remover
        // Alert.alert(item.title, item.overview?.substring(0,150) + '...');
      }}
    >
      <ExpoImage
        source={{ uri: item.posterUrl }}
        style={styles.posterImage}
        contentFit="cover"
        transition={150}
        placeholderContentFit="cover" // Para imagem de placeholder enquanto carrega
      />
      <ThemedText type="default" style={styles.movieTitle} numberOfLines={2}>
        {item.title}
      </ThemedText>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ThemedView
        style={[
          styles.loadingContainer,
          { backgroundColor: paperTheme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={paperTheme.colors.primary} />
        <ThemedText type="default" style={{ marginTop: 10 }}>
          Carregando filmes assistidos...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { backgroundColor: paperTheme.colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView
          style={[styles.container, { backgroundColor: "transparent" }]}
        >
          {/* Opcional: Título da página se não for usar o da Tab */}
          {/* <ThemedText type="title" style={styles.pageTitle}>Meus Filmes Assistidos</ThemedText> */}

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: paperTheme.colors.primary,
                  color: paperTheme.colors.onSurface,
                  backgroundColor: paperTheme.colors.surfaceVariant,
                  fontFamily: "GlassAntiqua-Inline", // Aplicando a fonte
                },
              ]}
              placeholder="Digite o título do filme assistido"
              placeholderTextColor={paperTheme.colors.onSurfaceVariant}
              value={movieTitleInput}
              onChangeText={setMovieTitleInput}
              onSubmitEditing={handleAddMovie} // Adiciona ao pressionar Enter
              editable={!isAdding}
            />
            <PaperButton
              mode="elevated"
              onPress={handleAddMovie}
              disabled={isAdding}
              loading={isAdding}
              style={styles.addButton}
              labelStyle={{ fontFamily: "GlassAntiqua-Inline", fontSize: 18 }} // Aplicando a fonte
              textColor={paperTheme.colors.primary}
            >
              {isAdding ? "Adicionando..." : "Adicionar"}
            </PaperButton>
          </View>

          {watchedMovies.length === 0 && !isLoading && !isAdding && (
            <ThemedText type="default" style={styles.emptyListText}>
              Sua lista de filmes assistidos está vazia. Adicione alguns!
            </ThemedText>
          )}

          <FlatList
            data={watchedMovies}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3} // Define o layout de grade
            contentContainerStyle={styles.listContentContainer}
            // O ScrollView principal já cuida da rolagem geral.
            // Se a lista for muito longa e o input precisar ficar fixo,
            // pode-se remover o ScrollView e dar um flex: 1 para o FlatList.
          />
        </ThemedView>
      </ScrollView>

      <Portal>
        <Dialog visible={errorDialogVisible} onDismiss={hideErrorDialog}>
          <Dialog.Icon
            icon="alert-circle-outline"
            size={32}
            color={paperTheme.colors.error}
          />
          <Dialog.Title
            style={[styles.dialogTitle, { fontFamily: "GlassAntiqua-Inline" }]}
          >
            Atenção
          </Dialog.Title>
          <Dialog.Content>
            <PaperText
              variant="bodyMedium"
              style={[
                styles.dialogContentText,
                { fontFamily: "GlassAntiqua-Inline" },
              ]}
            >
              {error?.message || "Ocorreu um erro desconhecido."}
            </PaperText>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton
              onPress={hideErrorDialog}
              labelStyle={[
                styles.dialogButtonLabel,
                { fontFamily: "GlassAntiqua-Inline" },
              ]}
              textColor={paperTheme.colors.primary}
            >
              OK
            </PaperButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
