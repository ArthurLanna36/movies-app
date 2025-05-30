// services/tmdbService.ts
import { Movie } from "@/constants/MovieData"; //

const API_KEY =
  process.env.EXPO_PUBLIC_TMDB_API_KEY || "YOUR_API_KEY_HERE_AS_FALLBACK"; // Fallback API key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";
const PLACEHOLDER_IMAGE_URL =
  "https://via.placeholder.com/200x300?text=Not+Found";

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
 * Searches for the first movie matching a title on TMDB.
 * @param title The title of the movie to search for.
 * @returns A promise that resolves to a Movie object or null if not found.
 */
export const searchMovieByTitle = async (
  title: string
): Promise<Movie | null> => {
  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE_AS_FALLBACK") {
    console.warn("TMDB API Key not configured in searchMovieByTitle.");
    return {
      id: Date.now().toString(),
      title: `${title} (API Key Missing)`,
      posterUrl: PLACEHOLDER_IMAGE_URL,
      overview: "TMDB API Key not configured.",
    };
  }

  if (!title.trim()) {
    console.warn("Search title is empty.");
    return null;
  }

  try {
    const response = await fetch(
      // Using en-US for API results language for consistency with error messages
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
        title
      )}&page=1`
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `Error in TMDB API search: ${response.status} - ${response.statusText}`,
        errorData
      );
      throw new Error(`Failed to fetch movie by title: ${response.statusText}`);
    }

    const data: TmdbSearchResponse = await response.json();

    if (data.results && data.results.length > 0) {
      const tmdbMovie = data.results[0];
      return {
        id: tmdbMovie.id.toString(),
        title: tmdbMovie.title,
        posterUrl: tmdbMovie.poster_path
          ? `${IMAGE_BASE_URL}${tmdbMovie.poster_path}`
          : PLACEHOLDER_IMAGE_URL,
        overview: tmdbMovie.overview,
      };
    } else {
      // Log (in English) when no movie is found with the given title
      console.log(`No movie found with the title: "${title}"`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching movie by title from TMDB:", error);
    throw error;
  }
};
