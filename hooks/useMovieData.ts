// hooks/useMovieData.ts
import { INITIAL_MOVIES, Movie } from '@/constants/MovieData';
import { fetchPopularMovies } from '@/services/tmdbService'; // Importe o serviço real
import { useCallback, useEffect, useState } from 'react';

interface UseMovieDataReturn {
  movies: Movie[];
  isLoading: boolean;
  error: Error | null;
  refreshMovies: () => Promise<void>; // Renomeado para clareza, ou pode ser loadNextPage, etc.
  currentPage: number;
}

const MAX_MOVIES_FOR_WHEEL = 10; // Quantos filmes você quer na roleta

export function useMovieData(initialLoad: boolean = true): UseMovieDataReturn {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // Para buscar diferentes páginas de populares

  const loadMoviesInternal = useCallback(async (pageToLoad: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedMovies = await fetchPopularMovies(pageToLoad);
      if (fetchedMovies.length > 0) {
        // Para a roleta, normalmente queremos um conjunto novo a cada "refresh"
        // Se quisesse paginação infinita para uma lista, seria setMovies(prev => [...prev, ...fetchedMovies]);
        setMovies(fetchedMovies.slice(0, MAX_MOVIES_FOR_WHEEL));
      } else if (pageToLoad === 1) {
        // Se a primeira página não retornar nada, pode ser um problema com a API ou chave
        console.warn("Nenhum filme retornado pela API na primeira página. Verifique a chave ou o serviço.");
        setMovies(INITIAL_MOVIES.slice(0, MAX_MOVIES_FOR_WHEEL)); // Fallback
      }
      // Se você quiser que cada "refresh" busque uma página diferente para variedade:
      // setCurrentPage(prevPage => prevPage + 1);
    } catch (e) {
      console.error("Erro em loadMoviesInternal (useMovieData):", e);
      setError(e instanceof Error ? e : new Error('Erro desconhecido ao carregar filmes'));
      setMovies(INITIAL_MOVIES.slice(0, MAX_MOVIES_FOR_WHEEL)); // Fallback em caso de erro
    } finally {
      setIsLoading(false);
    }
  }, []); // Removida currentPage das dependências do useCallback para que refreshMovies sempre pegue uma nova página se incrementarmos

  const refreshMovies = useCallback(async () => {
    // Incrementa a página para buscar novos filmes, ou reseta para 1,
    // ou busca uma página aleatória dentro de um limite.
    // Exemplo simples: buscar sempre uma nova página sequencial.
    const nextPage = currentPage + 1; // Ou uma lógica mais sofisticada para variedade
    setCurrentPage(nextPage); // Atualiza o estado da página
    await loadMoviesInternal(nextPage); // Carrega a próxima página
  }, [loadMoviesInternal, currentPage]);


  useEffect(() => {
    if (initialLoad) {
      loadMoviesInternal(1); // Carrega a primeira página inicialmente
    }
  }, [initialLoad, loadMoviesInternal]);

  return { movies, isLoading, error, refreshMovies, currentPage };
}