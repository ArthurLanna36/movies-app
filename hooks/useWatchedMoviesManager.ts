// hooks/useWatchedMoviesManager.ts
import { Movie } from "@/constants/MovieData";
import {
  addWatchedMovieToFirestore,
  loadWatchedMoviesFromFirestore,
} from "@/services/fireStoreService";
import { searchMovieByTitle } from "@/services/tmdbService";
import { useCallback, useEffect, useState } from "react";

interface UseWatchedMoviesManagerReturn {
  watchedMovies: Movie[];
  addMovieToWatchedList: (title: string) => Promise<Movie | null>;
  // removeMovieFromWatched: (movieId: string) => Promise<void>; // Para uso futuro
  isLoading: boolean;
  isAdding: boolean;
  error: Error | null;
  clearError: () => void;
}

export function useWatchedMoviesManager(): UseWatchedMoviesManagerReturn {
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = () => setError(null);

  const sortMovies = (movies: Movie[]) => {
    return [...movies].sort((a, b) => a.title.localeCompare(b.title));
  };

  // Carregar filmes do Firestore ao iniciar
  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loaded = await loadWatchedMoviesFromFirestore();
        setWatchedMovies(sortMovies(loaded));
      } catch (e) {
        console.error("Erro ao carregar filmes assistidos:", e);
        setError(
          e instanceof Error
            ? e
            : new Error("Falha ao carregar lista de assistidos.")
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
        setError(new Error("Por favor, digite o título de um filme."));
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
                `"${foundMovie.title}" já está na sua lista de assistidos.`
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
          setError(new Error(`Filme "${title}" não encontrado.`));
          setIsAdding(false);
          return null;
        }
      } catch (e) {
        console.error("Erro ao adicionar filme à lista de assistidos:", e);
        const errorMessage =
          e instanceof Error
            ? e.message
            : "Erro desconhecido ao adicionar filme.";
        setError(new Error(errorMessage));
        setIsAdding(false);
        return null;
      }
    },
    [watchedMovies]
  );

  // Função para remover (exemplo para o futuro)
  /*
  const removeMovieFromWatched = useCallback(async (movieId: string) => {
    // setIsRemoving(true); // Adicionar estado de remoção se necessário
    setError(null);
    try {
      await removeWatchedMovieFromFirestore(movieId);
      setWatchedMovies(prevMovies => sortMovies(prevMovies.filter(movie => movie.id !== movieId)));
    } catch (e) {
      console.error("Erro ao remover filme da lista de assistidos:", e);
      setError(e instanceof Error ? e : new Error('Falha ao remover filme da lista.'));
    } finally {
      // setIsRemoving(false);
    }
  }, []);
  */

  return {
    watchedMovies,
    addMovieToWatchedList,
    // removeMovieFromWatched,
    isLoading,
    isAdding,
    error,
    clearError,
  };
}
