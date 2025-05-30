// app/(tabs)/watched.tsx
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Movie } from "@/constants/MovieData";
import { useWatchedMoviesManager } from "@/hooks/useWatchedMoviesManager";
import { BlurView } from "expo-blur"; //
import { Image as ExpoImage } from "expo-image";
import React, { useState } from "react";
import {
  ActivityIndicator,
  // ScrollView, // REMOVED ScrollView
  Alert,
  FlatList, //
  StyleSheet, //
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Dialog,
  IconButton,
  Button as PaperButton,
  Text as PaperText, //
  Portal,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { styles } from "./styles/watched.styles";

export default function WatchedScreen() {
  const paperTheme = usePaperTheme();
  const {
    watchedMovies,
    addMovieToWatchedList,
    removeMovieFromWatchedList,
    isLoading,
    isAdding,
    isRemovingMovie,
    error,
    clearError,
  } = useWatchedMoviesManager();

  const [movieTitleInput, setMovieTitleInput] = useState("");
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [selectedForDeleteId, setSelectedForDeleteId] = useState<string | null>(
    null
  );

  React.useEffect(() => {
    if (error) {
      setErrorDialogVisible(true);
    }
  }, [error]);

  const handleAddMovie = async () => {
    if (!movieTitleInput.trim()) {
      // Could show an error directly or use the dialog
      return;
    }
    const added = await addMovieToWatchedList(movieTitleInput);
    if (added) {
      setMovieTitleInput("");
    }
  };

  const hideErrorDialog = () => {
    setErrorDialogVisible(false);
    clearError();
  };

  const handleToggleDeleteMode = (movieId: string) => {
    if (isRemovingMovie) return;

    if (selectedForDeleteId === movieId) {
      setSelectedForDeleteId(null);
    } else {
      setSelectedForDeleteId(movieId);
    }
  };

  const confirmAndExecuteDelete = (movie: Movie) => {
    if (isRemovingMovie) return;

    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to remove "${movie.title}" from your watched list?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setSelectedForDeleteId(null),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await removeMovieFromWatchedList(movie.id);
            setSelectedForDeleteId(null);
          },
        },
      ]
    );
  };

  const renderMovieItem = ({ item }: { item: Movie }) => {
    const isSelectedForDelete = selectedForDeleteId === item.id;

    return (
      <View style={styles.movieItemOuterContainer}>
        <TouchableOpacity
          style={styles.movieItemContainer}
          onPress={() => handleToggleDeleteMode(item.id)}
          activeOpacity={0.8}
          disabled={isRemovingMovie && !isSelectedForDelete}
        >
          <ExpoImage
            source={{ uri: item.posterUrl }}
            style={styles.posterImage}
            contentFit="cover"
            transition={150}
          />
          {isSelectedForDelete && (
            <BlurView
              intensity={50}
              tint={paperTheme.dark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          )}
          <ThemedText
            type="default"
            style={styles.movieTitle}
            numberOfLines={2}
          >
            {item.title}
          </ThemedText>
        </TouchableOpacity>

        {isSelectedForDelete && (
          <IconButton
            icon="close-circle"
            size={30}
            iconColor={paperTheme.colors.error}
            style={styles.deleteButton}
            onPress={() => confirmAndExecuteDelete(item)}
            disabled={isRemovingMovie}
          />
        )}
      </View>
    );
  };

  const ListHeader = () => (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: paperTheme.colors.primary,
              color: paperTheme.colors.onSurface,
              backgroundColor: paperTheme.colors.surfaceVariant,
              fontFamily: "GlassAntiqua-Inline", //
            },
          ]}
          placeholder="Enter title of watched movie"
          placeholderTextColor={paperTheme.colors.onSurfaceVariant}
          value={movieTitleInput}
          onChangeText={setMovieTitleInput}
          onSubmitEditing={handleAddMovie}
          editable={!isAdding && !isRemovingMovie}
        />
        <PaperButton
          mode="elevated"
          onPress={handleAddMovie}
          disabled={isAdding || isRemovingMovie}
          loading={isAdding}
          style={styles.addButton}
          labelStyle={{ fontFamily: "GlassAntiqua-Inline", fontSize: 18 }} //
          textColor={paperTheme.colors.primary}
        >
          {isAdding ? "Adding..." : "Add"}
        </PaperButton>
      </View>

      {isRemovingMovie && (
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <ActivityIndicator size="small" color={paperTheme.colors.primary} />
          <ThemedText type="default" style={{ fontSize: 12, marginTop: 4 }}>
            Removing movie...
          </ThemedText>
        </View>
      )}
    </View>
  );

  const EmptyListMessage = () => (
    <ThemedText type="default" style={styles.emptyListText}>
      Your watched movies list is empty. Add some!
    </ThemedText>
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
          Loading watched movies...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      {/* The ThemedView with styles.container is now the main container */}
      <ThemedView
        style={[
          styles.container,
          { backgroundColor: paperTheme.colors.background },
        ]}
      >
        <FlatList
          ListHeaderComponent={ListHeader} // Input fields and other top content
          data={watchedMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.listContentContainer} // Existing style for padding within the list
          ListEmptyComponent={
            watchedMovies.length === 0 && !isLoading && !isAdding
              ? EmptyListMessage
              : null
          }
        />
      </ThemedView>

      <Portal>
        <Dialog visible={errorDialogVisible} onDismiss={hideErrorDialog}>
          <Dialog.Icon
            icon="alert-circle-outline"
            size={32}
            color={paperTheme.colors.error}
          />
          <Dialog.Title
            style={[styles.dialogTitle, { fontFamily: "GlassAntiqua-Inline" }]} //
          >
            Attention
          </Dialog.Title>
          <Dialog.Content>
            <PaperText
              variant="bodyMedium"
              style={[
                styles.dialogContentText,
                { fontFamily: "GlassAntiqua-Inline" }, //
              ]}
            >
              {error?.message || "An unknown error occurred."}
            </PaperText>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton
              onPress={hideErrorDialog}
              labelStyle={[
                styles.dialogButtonLabel,
                { fontFamily: "GlassAntiqua-Inline" }, //
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
