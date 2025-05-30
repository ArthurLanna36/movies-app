// hooks/useWatchedMoviesManager.ts
import { Movie } from "@/constants/MovieData";
import { useAuth } from "@/context/AuthContext";
import {
  addWatchedMovieToFirestore,
  loadWatchedMoviesFromFirestore,
  removeWatchedMovieFromFirestore,
} from "@/services/fireStoreService";
import { searchMovieByTitle } from "@/services/tmdbService";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

interface UseWatchedMoviesManagerReturn {
  watchedMovies: Movie[];
  addMovieToWatchedList: (title: string) => Promise<Movie | null>;
  removeMovieFromWatchedList: (movieId: string) => Promise<void>;
  isLoading: boolean;
  isAdding: boolean;
  isRemovingMovie: boolean;
  error: Error | null;
  clearError: () => void;
}

export function useWatchedMoviesManager(): UseWatchedMoviesManagerReturn {
  const { user } = useAuth();
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isRemovingMovie, setIsRemovingMovie] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = () => setError(null);

  const sortMovies = (movies: Movie[]) => {
    return [...movies].sort((a, b) => a.title.localeCompare(b.title));
  };

  useEffect(() => {
    if (!user?.uid) {
      setIsLoading(false);
      setWatchedMovies([]);
      return;
    }
    const userId = user.uid;
    const loadMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loaded = await loadWatchedMoviesFromFirestore(userId);
        setWatchedMovies(sortMovies(loaded));
      } catch (e) {
        console.error("Error loading watched movies:", e);
        setError(
          e instanceof Error ? e : new Error("Failed to load watched list.")
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadMovies();
  }, [user?.uid]);

  const addMovieToWatchedList = useCallback(
    async (title: string): Promise<Movie | null> => {
      if (!user?.uid) {
        Alert.alert(
          "Error",
          "You must be logged in to add movies to your watched list."
        );
        setError(new Error("User not authenticated."));
        return null;
      }
      const userId = user.uid;

      if (!title.trim()) {
        setError(new Error("Please enter a movie title."));
        return null;
      }
      setIsAdding(true);
      setError(null);
      try {
        const foundMovie = await searchMovieByTitle(title);
        if (foundMovie) {
          if (watchedMovies.find((movie) => movie.id === foundMovie.id)) {
            setError(
              new Error(
                `"${foundMovie.title}" is already in your watched list.`
              )
            );
            setIsAdding(false);
            return null;
          }
          await addWatchedMovieToFirestore(userId, foundMovie);
          setWatchedMovies((prevMovies) =>
            sortMovies([...prevMovies, foundMovie])
          );
          setIsAdding(false);
          return foundMovie;
        } else {
          setError(new Error(`Movie "${title}" not found.`));
          setIsAdding(false);
          return null;
        }
      } catch (e) {
        console.error("Error adding movie to watched list:", e);
        const errorMessage =
          e instanceof Error ? e.message : "Unknown error while adding movie.";
        setError(new Error(errorMessage));
        setIsAdding(false);
        return null;
      }
    },
    [watchedMovies, user?.uid]
  );

  const removeMovieFromWatchedList = useCallback(
    async (movieId: string) => {
      if (!user?.uid) {
        Alert.alert(
          "Error",
          "You must be logged in to remove movies from your watched list."
        );
        setError(new Error("User not authenticated."));
        return;
      }
      const userId = user.uid;

      setIsRemovingMovie(true);
      setError(null);
      try {
        await removeWatchedMovieFromFirestore(userId, movieId);
        setWatchedMovies((prevMovies) =>
          sortMovies(prevMovies.filter((movie) => movie.id !== movieId))
        );
      } catch (e) {
        console.error("Error removing movie from watched list:", e);
        setError(
          e instanceof Error
            ? e
            : new Error("Failed to remove movie from list.")
        );
      } finally {
        setIsRemovingMovie(false);
      }
    },
    [user?.uid]
  );

  return {
    watchedMovies,
    addMovieToWatchedList,
    removeMovieFromWatchedList,
    isLoading,
    isAdding,
    isRemovingMovie,
    error,
    clearError,
  };
}
