// hooks/useMovieData.ts
import { INITIAL_MOVIES, Movie } from '@/constants/MovieData';
import { useCallback, useEffect, useState } from 'react';
// Para usar o serviço real, descomente a linha abaixo e a chamada no loadMovies
// import { fetchPopularMovies } from '@/services/tmdbService';

interface UseMovieDataReturn {
  movies: Movie[];
  isLoading: boolean;
  error: Error | null;
  loadMovies: (page?: number) => Promise<void>;
}

const MAX_MOVIES_FOR_WHEEL = 10; // Defina quantos filmes você quer na roleta

export function useMovieData(initialLoad: boolean = true, initialPage: number = 1): UseMovieDataReturn {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const loadMovies = useCallback(async (pageToLoad: number = currentPage) => {
    setIsLoading(true);
    setError(null);
    try {
      // ---- Para usar dados reais da API (descomente quando o tmdbService estiver pronto) ----
      // const fetchedMovies = await fetchPopularMovies(pageToLoad);
      // if (fetchedMovies.length === 0 && pageToLoad === 1) {
      //   // Fallback para dados iniciais se a API não retornar nada na primeira página
      //   console.warn("API não retornou filmes, usando placeholders.");
      //   setMovies(INITIAL_MOVIES.slice(0, MAX_MOVIES_FOR_WHEEL));
      // } else {
      //   setMovies(fetchedMovies.slice(0, MAX_MOVIES_FOR_WHEEL));
      // }
      // ------------------------------------------------------------------------------------

      // ---- Para usar dados placeholder enquanto desenvolve (comente ou remova ao usar API) ----
      console.log("Usando filmes placeholder (useMovieData)");
      await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay da API
      setMovies(INITIAL_MOVIES.slice(0, MAX_MOVIES_FOR_WHEEL));
      // ------------------------------------------------------------------------------------

      if (pageToLoad !== currentPage) {
        setCurrentPage(pageToLoad);
      }
    } catch (e) {
      console.error("Erro em loadMovies:", e);
      setError(e instanceof Error ? e : new Error('Erro desconhecido ao carregar filmes'));
      setMovies(INITIAL_MOVIES.slice(0, MAX_MOVIES_FOR_WHEEL)); // Fallback em caso de erro
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    if (initialLoad) {
      loadMovies(initialPage);
    }
  }, [initialLoad, initialPage, loadMovies]);

  return { movies, isLoading, error, loadMovies };
}