// services/fireStoreService.ts
import { Movie } from "@/constants/MovieData";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const saveWheelMoviesToFirestore = async (
  userId: string,
  movies: Movie[]
): Promise<void> => {
  if (!userId) throw new Error("User ID is required to save wheel movies.");
  try {
    const wheelDocRef = doc(db, "userRoulettes", userId);
    await setDoc(wheelDocRef, { movies: movies, lastUpdated: new Date() });
    console.log(`Wheel list saved to Firestore for user: ${userId}!`);
  } catch (error) {
    console.error("Error saving Wheel list to Firestore:", error);
    throw error;
  }
};

export const loadWheelMoviesFromFirestore = async (
  userId: string
): Promise<Movie[]> => {
  if (!userId) {
    console.log("No user ID provided, returning empty wheel list.");
    return [];
  }
  try {
    const wheelDocRef = doc(db, "userRoulettes", userId);
    const docSnap = await getDoc(wheelDocRef);

    if (docSnap.exists()) {
      const movies = docSnap.data().movies as Movie[];
      const movieTitles = movies.map((movie) => movie.title);
      console.log(
        `Wheel list loaded from Firestore for user ${userId} (Titles):`,
        movieTitles
      );
      return movies;
    } else {
      console.log(`No Wheel list found in Firestore for user: ${userId}.`);
      return [];
    }
  } catch (error) {
    console.error("Error loading Wheel list from Firestore:", error);
    throw error;
  }
};

export const clearWheelMoviesInFirestore = async (
  userId: string
): Promise<void> => {
  if (!userId) throw new Error("User ID is required to clear wheel movies.");
  console.log(
    `fireStoreService: clearWheelMoviesInFirestore initiated for user ${userId}.`
  );
  try {
    const wheelDocRef = doc(db, "userRoulettes", userId);
    await setDoc(
      wheelDocRef,
      { movies: [], lastUpdated: new Date() },
      { merge: true }
    );
    console.log(`Wheel list cleared in Firestore for user: ${userId}!`);
  } catch (error) {
    console.error("Error clearing wheel list in Firestore:", error);
    throw error;
  }
};

export const removeSingleMovieFromFirestore = async (
  userId: string,
  movieId: string
): Promise<void> => {
  if (!userId) throw new Error("User ID is required to remove a movie.");
  try {
    const wheelDocRef = doc(db, "userRoulettes", userId);
    const docSnap = await getDoc(wheelDocRef);
    if (docSnap.exists()) {
      const movies = docSnap.data().movies as Movie[];
      const movieToRemove = movies.find((movie) => movie.id === movieId);
      if (movieToRemove) {
        await updateDoc(wheelDocRef, {
          movies: arrayRemove(movieToRemove),
          lastUpdated: new Date(),
        });
        console.log(
          `"${movieToRemove.title}" removed from Firestore wheel for user ${userId}!`
        );
      } else {
        console.warn(
          `Movie with ID ${movieId} not found in Firestore wheel for user ${userId} for removal.`
        );
      }
    }
  } catch (error) {
    console.error(
      `Error removing movie ${movieId} from Firestore wheel for user ${userId}:`,
      error
    );
    throw error;
  }
};

export const addWatchedMovieToFirestore = async (
  userId: string,
  movie: Movie
): Promise<void> => {
  if (!userId) throw new Error("User ID is required to add a watched movie.");
  try {
    const watchedDocRef = doc(db, "userWatchedMovies", userId);
    const docSnap = await getDoc(watchedDocRef);
    if (docSnap.exists()) {
      const existingMovies = docSnap.data().movies as Movie[];
      if (!existingMovies.find((m) => m.id === movie.id)) {
        await updateDoc(watchedDocRef, {
          movies: arrayUnion(movie),
          lastUpdated: new Date(),
        });
        console.log(
          `Movie added to watched list in Firestore for user ${userId}!`
        );
      } else {
        console.log(
          `Movie already exists in Firestore watched list for user ${userId}.`
        );
      }
    } else {
      await setDoc(watchedDocRef, { movies: [movie], lastUpdated: new Date() });
      console.log(
        `Watched Movies list created with the first movie in Firestore for user ${userId}!`
      );
    }
  } catch (error) {
    console.error("Error adding movie to watched list in Firestore:", error);
    throw error;
  }
};

export const loadWatchedMoviesFromFirestore = async (
  userId: string
): Promise<Movie[]> => {
  if (!userId) {
    console.log("No user ID provided, returning empty watched list.");
    return [];
  }
  try {
    const watchedDocRef = doc(db, "userWatchedMovies", userId);
    const docSnap = await getDoc(watchedDocRef);

    if (docSnap.exists()) {
      const movies = (docSnap.data().movies as Movie[]).sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      const movieTitles = movies.map((movie) => movie.title);
      console.log(
        `Watched list loaded from Firestore for user ${userId} (Titles):`,
        movieTitles
      );
      return movies;
    } else {
      console.log(`No watched list found in Firestore for user: ${userId}.`);
      return [];
    }
  } catch (error) {
    console.error("Error loading watched list from Firestore:", error);
    throw error;
  }
};

export const removeWatchedMovieFromFirestore = async (
  userId: string,
  movieId: string
): Promise<void> => {
  if (!userId)
    throw new Error("User ID is required to remove a watched movie.");
  try {
    const watchedDocRef = doc(db, "userWatchedMovies", userId);
    const docSnap = await getDoc(watchedDocRef);

    if (docSnap.exists()) {
      const movies = docSnap.data().movies as Movie[];
      const movieToRemove = movies.find((movie) => movie.id === movieId);
      if (movieToRemove) {
        await updateDoc(watchedDocRef, {
          movies: arrayRemove(movieToRemove),
          lastUpdated: new Date(),
        });
        console.log(
          `Deleted "${movieToRemove.title}" from the Watched Movies list for user ${userId}`
        );
      } else {
        console.warn(
          `Watched movie with ID ${movieId} not found in Firestore for user ${userId} for removal.`
        );
      }
    }
  } catch (error) {
    console.error(
      `Error removing watched movie ${movieId} from Firestore for user ${userId}:`,
      error
    );
    throw error;
  }
};
