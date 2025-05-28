// constants/MovieData.ts
export interface Movie {
  id: string; // Pode ser o ID do TMDB
  title: string;
  posterUrl: string;
  overview?: string; // Adicionado para o futuro
  // Outros campos relevantes do TMDB que você queira guardar
}

// INITIAL_MOVIES não é mais necessário para o funcionamento principal,
// mas pode ser mantido para testes ou como um fallback muito básico se desejar.
// export const INITIAL_MOVIES: Movie[] = [ ... ];