// app/(tabs)/watched.tsx
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Movie } from "@/constants/MovieData";
import { useWatchedMoviesManager } from "@/hooks/useWatchedMoviesManager";
import { BlurView } from "expo-blur"; // Import BlurView
import { Image as ExpoImage } from "expo-image";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView, // For delete confirmation
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Dialog,
  IconButton,
  Button as PaperButton,
  Text as PaperText,
  Portal,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { styles } from "./styles/watched.styles";

export default function WatchedScreen() {
  const paperTheme = usePaperTheme();
  const {
    watchedMovies,
    addMovieToWatchedList,
    removeMovieFromWatchedList, // Get the new function
    isLoading,
    isAdding,
    isRemovingMovie, // Get the new state
    error,
    clearError,
  } = useWatchedMoviesManager();

  const [movieTitleInput, setMovieTitleInput] = useState("");
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [selectedForDeleteId, setSelectedForDeleteId] = useState<string | null>(
    null
  ); // Tracks item tapped for delete

  React.useEffect(() => {
    if (error) {
      setErrorDialogVisible(true);
    }
  }, [error]);

  const handleAddMovie = async () => {
    if (!movieTitleInput.trim()) {
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
    if (isRemovingMovie) return; // Don't change selection if a delete is in progress

    if (selectedForDeleteId === movieId) {
      setSelectedForDeleteId(null); // Toggle off if already selected
    } else {
      setSelectedForDeleteId(movieId); // Select for delete
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
            setSelectedForDeleteId(null); // Clear selection after attempting deletion
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
          disabled={isRemovingMovie && !isSelectedForDelete} // Prevent selecting other items during a delete operation
        >
          <ExpoImage
            source={{ uri: item.posterUrl }}
            style={styles.posterImage}
            contentFit="cover"
            transition={150}
          />
          {isSelectedForDelete && (
            <BlurView
              intensity={50} // Adjust blur intensity as needed
              tint={paperTheme.dark ? "dark" : "light"} // Adapt tint to app theme
              style={StyleSheet.absoluteFill} // This makes BlurView cover its parent
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
            icon="close-circle" // MaterialCommunityIcons name for 'X' in a circle
            size={30}
            iconColor={paperTheme.colors.error}
            style={styles.deleteButton}
            onPress={() => confirmAndExecuteDelete(item)}
            disabled={isRemovingMovie} // Disable if already removing this or another movie
          />
        )}
      </View>
    );
  };

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
              labelStyle={{ fontFamily: "GlassAntiqua-Inline", fontSize: 18 }}
              textColor={paperTheme.colors.primary}
            >
              {isAdding ? "Adding..." : "Add"}
            </PaperButton>
          </View>

          {isRemovingMovie && ( // Global removing indicator (optional)
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <ActivityIndicator
                size="small"
                color={paperTheme.colors.primary}
              />
              <ThemedText type="default" style={{ fontSize: 12, marginTop: 4 }}>
                Removing movie...
              </ThemedText>
            </View>
          )}

          {watchedMovies.length === 0 && !isLoading && !isAdding && (
            <ThemedText type="default" style={styles.emptyListText}>
              Your watched movies list is empty. Add some!
            </ThemedText>
          )}

          <FlatList
            data={watchedMovies}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            contentContainerStyle={styles.listContentContainer}
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
            Attention
          </Dialog.Title>
          <Dialog.Content>
            <PaperText
              variant="bodyMedium"
              style={[
                styles.dialogContentText,
                { fontFamily: "GlassAntiqua-Inline" },
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
