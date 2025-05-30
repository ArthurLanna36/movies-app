// app/(tabs)/watched.tsx
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Movie } from "@/constants/MovieData"; //
import { useWatchedMoviesManager } from "@/hooks/useWatchedMoviesManager"; //
import { BlurView } from "expo-blur";
import { Image as ExpoImage } from "expo-image";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet, // Added StyleSheet back for the BlurView
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Dialog,
  IconButton, // Added IconButton back
  Button as PaperButton,
  Text as PaperText,
  Portal,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { styles } from "./styles/watched.styles"; //

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
  } = useWatchedMoviesManager(); //

  const [movieTitleInput, setMovieTitleInput] = useState("");
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);

  // State for delete confirmation dialog
  const [deleteConfirmDialogVisible, setDeleteConfirmDialogVisible] =
    useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  // State to track which movie item has the 'X' icon active
  const [selectedForDeleteId, setSelectedForDeleteId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (error) {
      setErrorDialogVisible(true);
    }
  }, [error]);

  const handleAddMovie = async () => {
    if (!movieTitleInput.trim()) {
      return;
    }
    const added = await addMovieToWatchedList(movieTitleInput); //
    if (added) {
      setMovieTitleInput("");
    }
  };

  const hideErrorDialog = () => {
    setErrorDialogVisible(false);
    clearError(); //
  };

  // Toggles the 'X' icon visibility for a movie item
  const toggleDeleteModeForItem = (movieId: string) => {
    if (isRemovingMovie) return; // Prevent changing selection during an ongoing removal

    if (selectedForDeleteId === movieId) {
      setSelectedForDeleteId(null); // Deselect if already selected
    } else {
      setSelectedForDeleteId(movieId); // Select new item
    }
  };

  // Called when the 'X' icon is pressed
  const handleDeleteIconPress = (movie: Movie) => {
    if (isRemovingMovie) return;
    setMovieToDelete(movie);
    setDeleteConfirmDialogVisible(true);
  };

  // Hides the delete confirmation dialog and clears selection states
  const hideDeleteConfirmDialog = () => {
    setMovieToDelete(null);
    setDeleteConfirmDialogVisible(false);
    // setSelectedForDeleteId(null); // Also clear the item selection state
  };

  // Called when the user confirms deletion in the Dialog
  const executeDeleteMovie = async () => {
    if (movieToDelete) {
      await removeMovieFromWatchedList(movieToDelete.id); //
    }
    hideDeleteConfirmDialog();
    setSelectedForDeleteId(null); // Clear the 'X' icon from the item
  };

  const renderMovieItem = ({ item }: { item: Movie }) => {
    const isSelectedForDeleteVisual = selectedForDeleteId === item.id;

    return (
      <View style={styles.movieItemOuterContainer}>
        <TouchableOpacity
          style={styles.movieItemContainer}
          onPress={() => toggleDeleteModeForItem(item.id)} // Toggle 'X' visibility on press
          activeOpacity={0.8}
          disabled={isRemovingMovie && !isSelectedForDeleteVisual}
        >
          <ExpoImage
            source={{ uri: item.posterUrl }}
            style={styles.posterImage}
            contentFit="cover"
            transition={150}
          />
          {isSelectedForDeleteVisual && ( // Show BlurView if item is selected for delete
            <BlurView
              intensity={50}
              tint={paperTheme.dark ? "dark" : "light"}
              style={StyleSheet.absoluteFill} // Ensures BlurView covers the item
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

        {isSelectedForDeleteVisual && ( // Show 'X' icon if item is selected for delete
          <IconButton
            icon="close-circle" // Or your preferred delete icon
            size={30}
            iconColor={paperTheme.colors.error}
            style={styles.deleteButton}
            onPress={() => handleDeleteIconPress(item)} // Open confirmation dialog on 'X' press
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
      <ThemedView
        style={[
          styles.container,
          { backgroundColor: paperTheme.colors.background },
        ]}
      >
        <FlatList
          ListHeaderComponent={ListHeader}
          data={watchedMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3} //
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={
            watchedMovies.length === 0 && !isLoading && !isAdding
              ? EmptyListMessage
              : null
          }
        />
      </ThemedView>

      <Portal>
        {/* Error Dialog for general errors from the hook */}
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          visible={deleteConfirmDialogVisible}
          onDismiss={hideDeleteConfirmDialog}
        >
          <Dialog.Icon
            icon="delete-alert-outline"
            size={32}
            color={paperTheme.colors.error}
          />
          <Dialog.Title
            style={[styles.dialogTitle, { fontFamily: "GlassAntiqua-Inline" }]}
          >
            Confirm Deletion
          </Dialog.Title>
          <Dialog.Content>
            <PaperText
              variant="bodyMedium"
              style={[
                styles.dialogContentText,
                { fontFamily: "GlassAntiqua-Inline" },
              ]}
            >
              {`Are you sure you want to remove "${
                movieToDelete?.title || ""
              }" from your watched list?`}
            </PaperText>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton
              onPress={hideDeleteConfirmDialog}
              labelStyle={[
                { fontFamily: "GlassAntiqua-Inline" },
                styles.dialogButtonLabel,
              ]}
              textColor={paperTheme.colors.primary}
            >
              Cancel
            </PaperButton>
            <PaperButton
              onPress={executeDeleteMovie}
              disabled={isRemovingMovie}
              loading={isRemovingMovie}
              labelStyle={[
                { fontFamily: "GlassAntiqua-Inline" },
                styles.dialogButtonLabel,
              ]}
              textColor={paperTheme.colors.error}
            >
              {isRemovingMovie ? "Deleting..." : "Delete"}
            </PaperButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
