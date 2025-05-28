// services/tmdbService.ts
import { Movie } from '@/constants/MovieData';

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY || 'SUA_CHAVE_DE_API_AQUI_COMO_FALLBACK';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w200'; // Para pôsteres na roleta
const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/200x300?text=Not+Found';

interface TmdbApiMovie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
}

interface TmdbSearchResponse {
  page: number;
  results: TmdbApiMovie[];
  total_pages: number;
  total_results: number;
}

/**
 * Busca o primeiro filme correspondente a um título no TMDB.
 * @param title O título do filme a ser buscado.
 * @returns Uma promessa que resolve para um objeto Movie ou null se não encontrado.
 */
export const searchMovieByTitle = async (title: string): Promise<Movie | null> => {
  if (!API_KEY || API_KEY === 'SUA_CHAVE_DE_API_AQUI_COMO_FALLBACK') {
    console.warn('Chave de API do TMDB não configurada em searchMovieByTitle.');
    // Retornar um filme placeholder se a chave não estiver configurada, para testes
    // Em um app real, você pode querer lançar um erro ou retornar null.
    return {
        id: Date.now().toString(), // ID placeholder
        title: `${title} (API Key Ausente)`,
        posterUrl: PLACEHOLDER_IMAGE_URL,
        overview: 'Chave da API TMDB não configurada.'
    };
    // throw new Error('Chave de API do TMDB não configurada.');
  }

  if (!title.trim()) {
    console.warn('Título da busca está vazio.');
    return null;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(title)}&page=1`
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `Erro na busca da API TMDB: ${response.status} - ${response.statusText}`,
        errorData
      );
      throw new Error(`Falha ao buscar filme por título: ${response.statusText}`);
    }

    const data: TmdbSearchResponse = await response.json();

    if (data.results && data.results.length > 0) {
      const tmdbMovie = data.results[0]; // Pega o primeiro resultado
      return {
        id: tmdbMovie.id.toString(),
        title: tmdbMovie.title,
        posterUrl: tmdbMovie.poster_path
          ? `${IMAGE_BASE_URL}${tmdbMovie.poster_path}`
          : PLACEHOLDER_IMAGE_URL,
        overview: tmdbMovie.overview,
      };
    } else {
      return null; // Nenhum filme encontrado
    }
  } catch (error) {
    console.error('Erro ao buscar filme por título no TMDB:', error);
    throw error;
  }
};

// A função fetchPopularMovies pode ser mantida se você quiser outra funcionalidade no futuro,
// ou removida se a roleta for exclusivamente populada pelo usuário.
// export const fetchPopularMovies = async (page: number = 1): Promise<Movie[]> => { /* ... */ };