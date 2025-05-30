import { PointerIcon } from "@/components/game/PointerIcon";
import { WheelGraphic } from "@/components/game/WheelGraphic";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Movie } from "@/constants/MovieData";
import { useTheme as useAppThemeHook } from "@/context/ThemeContext";
import { useWheelGame } from "@/hooks/useWheelGame";
import { useWheelItemsManager } from "@/hooks/useWheelItemsManager";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert as NativeAlert,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import {
  Dialog,
  Button as PaperButton,
  Text as PaperText,
  Portal,
  useTheme as usePaperTheme,
} from "react-native-paper";
import styles from "../../styles/index.styles";

export default function HomeScreen() {
  useAppThemeHook();
  const paperTheme = usePaperTheme();

  const {
    wheelMovies,
    addMovieToWheel,
    removeMovieById,
    clearWheel,
    isLoadingItems,
    isSavingItems,
    isLoadingMovie,
    isRemovingMovie,
    errorLoadingItems,
    errorAddingMovie,
  } = useWheelItemsManager();

  const { rotation, selectedItem, isSpinning, spinWheelLogic } = useWheelGame({
    items: wheelMovies,
    onSpinEnd: (movie: Movie) => {
      NativeAlert.alert(
        "Filme Sorteado!",
        `${movie.title}${
          movie.overview
            ? `\n\nSinopse: ${movie.overview.substring(0, 100)}...`
            : ""
        }`
      );
      console.log("Roleta parou em:", movie.title);
    },
  });

  const [movieTitleInput, setMovieTitleInput] = useState("");
  const [removeDialogVisible, setRemoveDialogVisible] = useState(false);
  const [movieToRemove, setMovieToRemove] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [clearDialogVisible, setClearDialogVisible] = useState(false);
  const [addMovieErrorDialogVisible, setAddMovieErrorDialogVisible] =
    useState(false);
  const [addMovieErrorMessage, setAddMovieErrorMessage] = useState("");

  useEffect(() => {
    if (
      errorAddingMovie &&
      (errorAddingMovie.message.includes("is already on the wheel") || // Updated to English
        errorAddingMovie.message.includes("not found") || // This will catch the new English message
        errorAddingMovie.message.includes("The wheel is already full") ||
        errorAddingMovie.message.includes(
          "Unknown error while searching for movie"
        ))
    ) {
      setAddMovieErrorMessage(errorAddingMovie.message);
      setAddMovieErrorDialogVisible(true);
    }
  }, [errorAddingMovie]);

  const handleAddMovie = async () => {
    if (!movieTitleInput.trim()) {
      setAddMovieErrorMessage("Por favor, digite o título de um filme.");
      setAddMovieErrorDialogVisible(true);
      return;
    }
    const addedMovie = await addMovieToWheel(movieTitleInput);
    if (addedMovie) {
      setMovieTitleInput("");
    }
  };

  const hideAddMovieErrorDialog = () => {
    setAddMovieErrorDialogVisible(false);
    setAddMovieErrorMessage("");
  };

  const showRemoveDialog = (movieId: string, movieTitle: string) => {
    if (isSpinning || isRemovingMovie) return;
    setMovieToRemove({ id: movieId, title: movieTitle });
    setRemoveDialogVisible(true);
  };

  const hideRemoveDialog = () => {
    setRemoveDialogVisible(false);
    setMovieToRemove(null);
  };

  const confirmRemoveMovie = async () => {
    if (movieToRemove) {
      await removeMovieById(movieToRemove.id);
    }
    hideRemoveDialog();
  };

  const showClearDialog = () => {
    if (isSpinning || isSavingItems) return;
    setClearDialogVisible(true);
  };

  const hideClearDialog = () => {
    setClearDialogVisible(false);
  };

  const confirmClearWheel = async () => {
    await clearWheel();
    hideClearDialog();
  };

  if (isLoadingItems) {
    return (
      <ThemedView
        style={[
          styles.container,
          {
            justifyContent: "center",
            backgroundColor: paperTheme.colors.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={paperTheme.colors.primary} />
        <ThemedText type="default" style={styles.loadingText}>
          Carregando sua roleta...
        </ThemedText>
      </ThemedView>
    );
  }
  if (errorLoadingItems) {
    return (
      <ThemedView
        style={[
          styles.container,
          {
            justifyContent: "center",
            backgroundColor: paperTheme.colors.background,
          },
        ]}
      >
        <ThemedText
          type="default"
          style={[styles.errorText, { color: paperTheme.colors.error }]}
        >
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
              onItemPress={(movieId) => {
                const moviePressed = wheelMovies.find((m) => m.id === movieId);
                if (moviePressed) {
                  showRemoveDialog(movieId, moviePressed.title);
                }
              }}
            />
          </View>
        </View>
        <PaperButton
          mode="contained"
          onPress={spinWheelLogic}
          disabled={
            isSpinning ||
            wheelMovies.length < 2 ||
            isSavingItems ||
            isRemovingMovie
          }
          loading={
            isSpinning || (isSavingItems && !isRemovingMovie && !isLoadingMovie)
          } // Mostrar loading no giro se estiver salvando
          style={styles.actionButtonContainer}
          labelStyle={{ fontFamily: "GlassAntiqua-Inline", fontSize: 24 }}
          textColor={paperTheme.colors.onPrimary}
        >
          {isSpinning
            ? "Girando..."
            : isRemovingMovie
            ? "Removendo..."
            : isSavingItems
            ? "Salvando..."
            : "Girar a Roleta!"}
        </PaperButton>
        {selectedItem && (
          <ThemedText type="subtitle" style={styles.resultText}>
            Sorteado: {selectedItem.title}
          </ThemedText>
        )}
      </>
    );
  } else if (!isLoadingMovie && !isSavingItems && !isRemovingMovie) {
    wheelSection = (
      <ThemedText type="default" style={styles.emptyWheelText}>
        Adicione filmes à roleta para começar!
      </ThemedText>
    );
  } else {
    wheelSection = null;
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
          <ThemedText type="title" style={styles.pageTitle}>
            Roleta de Filmes Personalizada
          </ThemedText>

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: paperTheme.colors.primary,
                  color: paperTheme.colors.onSurface,
                  backgroundColor: paperTheme.colors.surfaceVariant,
                  fontFamily: "GlassAntiqua-Inline",
                },
              ]}
              placeholder="Digite o título do filme"
              placeholderTextColor={paperTheme.colors.onSurfaceVariant}
              value={movieTitleInput}
              onChangeText={setMovieTitleInput}
              onSubmitEditing={handleAddMovie}
              editable={!isSavingItems && !isLoadingMovie && !isRemovingMovie}
            />
            <PaperButton
              mode="elevated"
              onPress={handleAddMovie}
              disabled={isLoadingMovie || isSavingItems || isRemovingMovie}
              loading={isLoadingMovie}
              labelStyle={{ fontFamily: "GlassAntiqua-Inline", fontSize: 18 }}
              textColor={paperTheme.colors.primary}
            >
              {isLoadingMovie
                ? "Buscando..."
                : isSavingItems
                ? "Salvando..."
                : isRemovingMovie
                ? "Removendo..."
                : "Adicionar Filme"}
            </PaperButton>
          </View>

          {/* Não precisamos mais exibir errorAddingMovie/errorRemovingMovie diretamente aqui, pois o Dialog cuida disso */}
          {/* Se ainda quiser um feedback textual na tela além do dialog, pode descomentar e ajustar */}
          {/*
          {errorAddingMovie && !addMovieErrorDialogVisible && (
            <PaperText style={[styles.errorText, { color: paperTheme.colors.error }]}>
              {errorAddingMovie.message}
            </PaperText>
          )}
          {errorRemovingMovie && !removeDialogVisible && (
            <PaperText style={[styles.errorText, { color: paperTheme.colors.error }]}>
              {errorRemovingMovie.message}
            </PaperText>
          )}
          */}

          {isSavingItems &&
            !isLoadingMovie &&
            !isRemovingMovie && ( // Mostrar 'Salvando' apenas se não for parte de outra operação
              <ThemedText type="default" style={styles.loadingText}>
                Salvando alterações...
              </ThemedText>
            )}
          {isLoadingMovie && wheelMovies.length === 0 && (
            <ThemedView
              style={[
                styles.loadingContainer,
                { backgroundColor: "transparent" },
              ]}
            >
              <ActivityIndicator
                size="small"
                color={paperTheme.colors.primary}
              />
              <ThemedText type="default" style={styles.loadingText}>
                Buscando seu filme...
              </ThemedText>
            </ThemedView>
          )}

          {wheelSection}

          {wheelMovies.length > 0 && !isRemovingMovie && (
            <View style={styles.clearButtonContainer}>
              <PaperButton
                mode="contained"
                buttonColor={paperTheme.colors.error}
                textColor={paperTheme.colors.onError}
                onPress={showClearDialog}
                disabled={isSavingItems || isSpinning || isLoadingMovie} // Desabilitar se estiver carregando filme também
                loading={
                  isSavingItems &&
                  wheelMovies.length > 0 &&
                  !isRemovingMovie &&
                  !isLoadingMovie
                }
                labelStyle={{ fontFamily: "GlassAntiqua-Inline", fontSize: 18 }}
              >
                {isSavingItems && !isLoadingMovie && !isRemovingMovie
                  ? "Limpando..."
                  : "Limpar Roleta"}
              </PaperButton>
            </View>
          )}
        </ThemedView>
      </ScrollView>

      <Portal>
        <Dialog
          visible={addMovieErrorDialogVisible}
          onDismiss={hideAddMovieErrorDialog}
        >
          <Dialog.Icon
            icon="alert-circle-outline"
            size={32}
            color={paperTheme.colors.error}
          />
          <Dialog.Title
            style={{ textAlign: "center", fontFamily: "GlassAntiqua-Inline" }}
          >
            {addMovieErrorMessage.includes("já está na roleta")
              ? "Filme Repetido"
              : addMovieErrorMessage.includes("não encontrado")
              ? "Não Encontrado"
              : addMovieErrorMessage.includes("A roleta já está cheia")
              ? "Roleta Cheia"
              : "Atenção"}
          </Dialog.Title>
          <Dialog.Content>
            <PaperText
              variant="bodyMedium"
              style={{ fontFamily: "GlassAntiqua-Inline", textAlign: "center" }}
            >
              {addMovieErrorMessage}
            </PaperText>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton
              onPress={hideAddMovieErrorDialog}
              labelStyle={{ fontFamily: "GlassAntiqua-Inline" }}
              textColor={paperTheme.colors.primary}
            >
              OK
            </PaperButton>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={removeDialogVisible} onDismiss={hideRemoveDialog}>
          <Dialog.Icon
            icon="delete-alert-outline"
            size={32}
            color={paperTheme.colors.error}
          />
          <Dialog.Title
            style={{ textAlign: "center", fontFamily: "GlassAntiqua-Inline" }}
          >
            Remover Filme
          </Dialog.Title>
          <Dialog.Content>
            <PaperText
              variant="bodyMedium"
              style={{ fontFamily: "GlassAntiqua-Inline", textAlign: "center" }}
            >
              {`Tem certeza que deseja remover &quot;${movieToRemove?.title}&quot; da roleta?`}
            </PaperText>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton
              onPress={hideRemoveDialog}
              labelStyle={{ fontFamily: "GlassAntiqua-Inline" }}
              textColor={paperTheme.colors.primary}
            >
              Cancelar
            </PaperButton>
            <PaperButton
              onPress={confirmRemoveMovie}
              labelStyle={{ fontFamily: "GlassAntiqua-Inline" }}
              textColor={paperTheme.colors.error}
            >
              Remover
            </PaperButton>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={clearDialogVisible} onDismiss={hideClearDialog}>
          <Dialog.Icon
            icon="trash-can-outline"
            size={32}
            color={paperTheme.colors.error}
          />
          <Dialog.Title
            style={{ textAlign: "center", fontFamily: "GlassAntiqua-Inline" }}
          >
            Limpar Roleta
          </Dialog.Title>
          <Dialog.Content>
            <PaperText
              variant="bodyMedium"
              style={{ fontFamily: "GlassAntiqua-Inline", textAlign: "center" }}
            >
              Tem certeza que deseja remover todos os filmes da roleta?
            </PaperText>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton
              onPress={hideClearDialog}
              labelStyle={{ fontFamily: "GlassAntiqua-Inline" }}
              textColor={paperTheme.colors.primary}
            >
              Cancelar
            </PaperButton>
            <PaperButton
              onPress={confirmClearWheel}
              labelStyle={{ fontFamily: "GlassAntiqua-Inline" }}
              textColor={paperTheme.colors.error}
            >
              Limpar
            </PaperButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
