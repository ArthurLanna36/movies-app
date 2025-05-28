// constants/MovieData.ts
export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  // Você pode adicionar outros campos aqui no futuro, como:
  // overview?: string;
  // releaseDate?: string;
  // voteAverage?: number;
}

// Filmes placeholder para desenvolvimento inicial
export const INITIAL_MOVIES: Movie[] = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  title: `Filme Placeholder ${i + 1}`,
  posterUrl: `https://via.placeholder.com/200x300?text=Filme+${i + 1}`,
}));