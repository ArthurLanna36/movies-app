// hooks/useWheelItemsManager.ts
import { Movie } from "@/constants/MovieData"; //
import {
  clearWheelMoviesInFirestore,
  loadWheelMoviesFromFirestore,
  removeSingleMovieFromFirestore,
  saveWheelMoviesToFirestore,
} from "@/services/fireStoreService"; //
import { searchMovieByTitle } from "@/services/tmdbService"; //
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseWheelItemsManagerReturn {
  wheelMovies: Movie[];
  addMovieToWheel: (title: string) => Promise<Movie | null>;
  removeMovieById: (movieId: string) => Promise<void>;
  clearWheel: () => Promise<void>;
  isLoadingItems: boolean;
  isSavingItems: boolean;
  isLoadingMovie: boolean;
  isRemovingMovie: boolean;
  errorLoadingItems: Error | null;
  errorSavingItems: Error | null;
  errorAddingMovie: Error | null;
  errorRemovingMovie: Error | null;
}

const MAX_WHEEL_ITEMS = 10;

export function useWheelItemsManager(): UseWheelItemsManagerReturn {
  const [wheelMovies, setWheelMovies] = useState<Movie[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(true);
  const [isSavingItems, setIsSavingItems] = useState<boolean>(false);
  const [isLoadingMovie, setIsLoadingMovie] = useState<boolean>(false);
  const [isRemovingMovie, setIsRemovingMovie] = useState<boolean>(false);
  const [errorLoadingItems, setErrorLoadingItems] = useState<Error | null>(
    null
  );
  const [errorSavingItems, setErrorSavingItems] = useState<Error | null>(null);
  const [errorAddingMovie, setErrorAddingMovie] = useState<Error | null>(null);
  const [errorRemovingMovie, setErrorRemovingMovie] = useState<Error | null>(
    null
  );

  // Load movies from Firestore on hook initialization
  useEffect(() => {
    const loadInitialMovies = async () => {
      setIsLoadingItems(true);
      setErrorLoadingItems(null);
      try {
        const loadedMovies = await loadWheelMoviesFromFirestore(); //
        setWheelMovies(loadedMovies);
      } catch (e) {
        console.error("Error loading initial movies from Firestore:", e);
        setErrorLoadingItems(
          e instanceof Error ? e : new Error("Failed to load saved list.")
        );
      } finally {
        setIsLoadingItems(false);
      }
    };
    loadInitialMovies();
  }, []);

  // Save to Firestore whenever wheelMovies changes
  useEffect(() => {
    if (!isLoadingItems) {
      const saveMovies = async () => {
        if (isRemovingMovie) return;

        setIsSavingItems(true);
        setErrorSavingItems(null);
        try {
          await saveWheelMoviesToFirestore(wheelMovies); //
        } catch (e) {
          console.error("Error saving movies to Firestore:", e);
          setErrorSavingItems(
            e instanceof Error ? e : new Error("Failed to save list.")
          );
          Alert.alert("Error", "Could not save your changes to the wheel.");
        } finally {
          setIsSavingItems(false);
        }
      };
      saveMovies();
    }
  }, [wheelMovies, isLoadingItems, isRemovingMovie]);

  const addMovieToWheel = useCallback(
    async (title: string): Promise<Movie | null> => {
      if (wheelMovies.length >= MAX_WHEEL_ITEMS) {
        Alert.alert(
          "Wheel Full",
          `You can add up to ${MAX_WHEEL_ITEMS} movies.`
        );
        setErrorAddingMovie(
          new Error(`The wheel is already full (${MAX_WHEEL_ITEMS} movies).`)
        );
        return null;
      }
      setIsLoadingMovie(true);
      setErrorAddingMovie(null);
      try {
        const foundMovie = await searchMovieByTitle(title); //
        if (foundMovie) {
          if (wheelMovies.find((movie) => movie.id === foundMovie.id)) {
            const errorMessage = `"${foundMovie.title}" is already on the wheel.`;
            setErrorAddingMovie(new Error(errorMessage));
            setIsLoadingMovie(false);
            return null;
          }
          setWheelMovies((prevMovies) => [...prevMovies, foundMovie]);
          setIsLoadingMovie(false);
          return foundMovie;
        } else {
          // Set English error message when movie is not found
          const errorMessage = `Movie "${title}" not found.`;
          setErrorAddingMovie(new Error(errorMessage));
          setIsLoadingMovie(false);
          return null;
        }
      } catch (e) {
        console.error("Error adding movie to wheel:", e);
        const errorMessage =
          e instanceof Error
            ? e.message
            : "Unknown error while searching for movie.";
        setErrorAddingMovie(new Error(errorMessage));
        setIsLoadingMovie(false);
        return null;
      }
    },
    [wheelMovies]
  );

  const clearWheel = useCallback(async () => {
    setIsSavingItems(true);
    setErrorSavingItems(null);
    try {
      await clearWheelMoviesInFirestore(); //
      setWheelMovies([]);
    } catch (e) {
      setErrorSavingItems(
        e instanceof Error ? e : new Error("Failed to clear the wheel.")
      );
      Alert.alert("Error", "Could not clear the wheel on the server.");
    } finally {
      setIsSavingItems(false);
    }
  }, []);

  const removeMovieById = useCallback(async (movieId: string) => {
    setErrorRemovingMovie(null);
    setIsRemovingMovie(true);
    try {
      await removeSingleMovieFromFirestore(movieId); //
      setWheelMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId)
      );
      console.log(`Movie ${movieId} removed locally and from Firestore.`);
    } catch (e) {
      console.error(`Error removing movie ${movieId}:`, e);
      setErrorRemovingMovie(
        e instanceof Error ? e : new Error("Failed to remove movie.")
      );
      Alert.alert("Error", "Could not remove the movie from the wheel.");
    } finally {
      setIsRemovingMovie(false);
    }
  }, []);

  return {
    wheelMovies,
    addMovieToWheel,
    removeMovieById,
    clearWheel,
    isLoadingItems,
    isSavingItems,
    isLoadingMovie,
    isRemovingMovie,
    errorLoadingItems,
    errorSavingItems,
    errorAddingMovie,
    errorRemovingMovie,
  };
}
