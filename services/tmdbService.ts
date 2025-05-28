// services/tmdbService.ts
import { Movie } from '@/constants/MovieData'; // Reutilize sua interface Movie

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w200'; // w200 é um bom tamanho para pôsteres na roleta

interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  // Adicione outros campos que você queira do TMDB
}

interface TmdbPagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Função para buscar filmes populares (ou outro endpoint de sua escolha)
export const fetchPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(`<span class="math-inline">\{BASE\_URL\}/movie/popular?api\_key\=</span>{API_KEY}&language=pt-BR&page=${page}`);
    if (!response.ok) {
      console.error('Erro na resposta da API TMDB:', response.status, await response.text());
      throw new Error('Falha ao buscar filmes populares da API');
    }
    const data: TmdbPagedResponse<TmdbMovie> = await response.json();

    return data.results.map(tmdbMovie => ({
      id: tmdbMovie.id.toString(),
      title: tmdbMovie.title,
      posterUrl: tmdbMovie.poster_path ? `<span class="math-inline">\{IMAGE\_BASE\_URL\}</span>{tmdbMovie.poster_path}` : 'https://via.placeholder.com/200x300?text=Sem+Imagem', // Placeholder se não houver pôster
      // Mapeie outros campos se necessário
    }));
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error);
    return []; // Retorna array vazio em caso de erro para não quebrar a UI
  }
};

// Você pode adicionar outras funções aqui:
// - fetchMovieDetails(movieId: string)
// - searchMovies(query: string)
// - fetchMoviesByGenre(genreId: number)