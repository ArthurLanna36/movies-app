// hooks/useWatchedMoviesManager.ts
import { Movie } from "@/constants/MovieData";
import {
  addWatchedMovieToFirestore,
  loadWatchedMoviesFromFirestore,
  removeWatchedMovieFromFirestore, // Import the remove function
} from "@/services/fireStoreService";
import { searchMovieByTitle } from "@/services/tmdbService";
import { useCallback, useEffect, useState } from "react";

interface UseWatchedMoviesManagerReturn {
  watchedMovies: Movie[];
  addMovieToWatchedList: (title: string) => Promise<Movie | null>;
  removeMovieFromWatchedList: (movieId: string) => Promise<void>; // New function
  isLoading: boolean;
  isAdding: boolean;
  isRemovingMovie: boolean; // New state
  error: Error | null;
  clearError: () => void;
}

export function useWatchedMoviesManager(): UseWatchedMoviesManagerReturn {
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isRemovingMovie, setIsRemovingMovie] = useState<boolean>(false); // State for removal process
  const [error, setError] = useState<Error | null>(null);

  const clearError = () => setError(null);

  const sortMovies = (movies: Movie[]) => {
    return [...movies].sort((a, b) => a.title.localeCompare(b.title));
  };

  // Load movies from Firestore on init
  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loaded = await loadWatchedMoviesFromFirestore();
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
  }, []);

  const addMovieToWatchedList = useCallback(
    async (title: string): Promise<Movie | null> => {
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
          await addWatchedMovieToFirestore(foundMovie);
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
    [watchedMovies]
  );

  // Function to remove a movie from the watched list
  const removeMovieFromWatchedList = useCallback(async (movieId: string) => {
    setIsRemovingMovie(true);
    setError(null);
    try {
      await removeWatchedMovieFromFirestore(movieId); // Call Firestore service
      setWatchedMovies((prevMovies) =>
        sortMovies(prevMovies.filter((movie) => movie.id !== movieId))
      );
    } catch (e) {
      console.error("Error removing movie from watched list:", e);
      setError(
        e instanceof Error ? e : new Error("Failed to remove movie from list.")
      );
      // Optionally, you might want to re-throw or handle the UI rollback differently
    } finally {
      setIsRemovingMovie(false);
    }
  }, []);

  return {
    watchedMovies,
    addMovieToWatchedList,
    removeMovieFromWatchedList, // Export the new function
    isLoading,
    isAdding,
    isRemovingMovie, // Export the new state
    error,
    clearError,
  };
}
