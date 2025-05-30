// services/firestoreService.ts
import { Movie } from "@/constants/MovieData"; //
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore"; //
import { db } from "../config/firebaseConfig"; //

const USER_DEVICE_ID = "defaultUserWheel"; //
const WATCHED_MOVIES_DOC_ID = "defaultUserWatched"; //

/**
 * Saves the current list of wheel movies for the user/device.
 * If a list already exists, it will be replaced.
 */
export const saveWheelMoviesToFirestore = async (
  movies: Movie[]
): Promise<void> => {
  try {
    const wheelDocRef = doc(db, "userRoulettes", USER_DEVICE_ID); //
    await setDoc(wheelDocRef, { movies: movies, lastUpdated: new Date() }); //
    console.log("Wheel list saved to Firestore!"); //
  } catch (error) {
    console.error("Error saving wheel list to Firestore:", error); //
    throw error;
  }
};

/**
 * Loads the wheel movies list from Firestore for the user/device.
 */
export const loadWheelMoviesFromFirestore = async (): Promise<Movie[]> => {
  try {
    const wheelDocRef = doc(db, "userRoulettes", USER_DEVICE_ID); //
    const docSnap = await getDoc(wheelDocRef); //

    if (docSnap.exists()) {
      const movies = docSnap.data().movies as Movie[]; //
      // MODIFIED LOG: Log only movie titles
      const movieTitles = movies.map((movie) => movie.title);
      console.log("Wheel list loaded from Firestore (Titles):", movieTitles);
      return movies;
    } else {
      console.log("No wheel list found in Firestore for this user."); //
      return [];
    }
  } catch (error) {
    console.error("Error loading wheel list from Firestore:", error); //
    throw error;
  }
};

/**
 * Clears the wheel movies list in Firestore for the user/device.
 */
export const clearWheelMoviesInFirestore = async (): Promise<void> => {
  console.log("fireStoreService: clearWheelMoviesInFirestore initiated."); //
  try {
    const wheelDocRef = doc(db, "userRoulettes", USER_DEVICE_ID); //
    await setDoc(
      wheelDocRef,
      { movies: [], lastUpdated: new Date() },
      { merge: true }
    ); //
    console.log("Wheel list cleared in Firestore!"); //
  } catch (error) {
    console.error("Error clearing wheel list in Firestore:", error); //
    throw error;
  }
};

/**
 * Removes a specific movie from the wheel list in Firestore.
 */
export const removeSingleMovieFromFirestore = async (
  movieId: string
): Promise<void> => {
  try {
    const wheelDocRef = doc(db, "userRoulettes", USER_DEVICE_ID); //
    const docSnap = await getDoc(wheelDocRef); //
    if (docSnap.exists()) {
      const movies = docSnap.data().movies as Movie[]; //
      const movieToRemove = movies.find((movie) => movie.id === movieId); //
      if (movieToRemove) {
        await updateDoc(wheelDocRef, {
          movies: arrayRemove(movieToRemove), //
          lastUpdated: new Date(),
        });
        console.log(`Movie with ID ${movieId} removed from Firestore wheel!`); //
      } else {
        console.warn(
          `Movie with ID ${movieId} not found in Firestore wheel for removal.`
        ); //
      }
    }
  } catch (error) {
    console.error(
      `Error removing movie ${movieId} from Firestore wheel:`,
      error
    ); //
    throw error;
  }
};

/**
 * Saves a single movie to the watched list in Firestore.
 * Avoids duplicates based on movie ID.
 */
export const addWatchedMovieToFirestore = async (
  movie: Movie
): Promise<void> => {
  try {
    const watchedDocRef = doc(db, "userWatchedMovies", WATCHED_MOVIES_DOC_ID); //
    const docSnap = await getDoc(watchedDocRef); //
    if (docSnap.exists()) {
      const existingMovies = docSnap.data().movies as Movie[]; //
      if (!existingMovies.find((m) => m.id === movie.id)) {
        //
        await updateDoc(watchedDocRef, {
          movies: arrayUnion(movie), //
          lastUpdated: new Date(),
        });
        console.log("Movie added to watched list in Firestore!"); //
      } else {
        console.log("Movie already exists in Firestore watched list."); //
      }
    } else {
      await setDoc(watchedDocRef, { movies: [movie], lastUpdated: new Date() }); //
      console.log("Watched list created with the first movie in Firestore!"); //
    }
  } catch (error) {
    console.error("Error adding movie to watched list in Firestore:", error); //
    throw error;
  }
};

/**
 * Loads the watched movies list from Firestore.
 */
export const loadWatchedMoviesFromFirestore = async (): Promise<Movie[]> => {
  try {
    const watchedDocRef = doc(db, "userWatchedMovies", WATCHED_MOVIES_DOC_ID); //
    const docSnap = await getDoc(watchedDocRef); //

    if (docSnap.exists()) {
      const movies = (docSnap.data().movies as Movie[]).sort(
        (
          a,
          b //
        ) => a.title.localeCompare(b.title)
      );
      // MODIFIED LOG: Log only movie titles
      const movieTitles = movies.map((movie) => movie.title);
      console.log(
        "Watched list loaded from Firestore (Titles):", //
        movieTitles
      );
      return movies;
    } else {
      console.log("No watched list found in Firestore."); //
      return [];
    }
  } catch (error) {
    console.error("Error loading watched list from Firestore:", error); //
    throw error;
  }
};

/**
 * Removes a specific movie from the watched list in Firestore.
 */
export const removeWatchedMovieFromFirestore = async (
  movieId: string
): Promise<void> => {
  try {
    const watchedDocRef = doc(db, "userWatchedMovies", WATCHED_MOVIES_DOC_ID); //
    const docSnap = await getDoc(watchedDocRef); //

    if (docSnap.exists()) {
      const movies = docSnap.data().movies as Movie[]; //
      const movieToRemove = movies.find((movie) => movie.id === movieId); //
      if (movieToRemove) {
        await updateDoc(watchedDocRef, {
          movies: arrayRemove(movieToRemove), //
          lastUpdated: new Date(),
        });
        console.log(`Watched movie with ID ${movieId} removed from Firestore!`); //
      } else {
        console.warn(
          `Watched movie with ID ${movieId} not found in Firestore for removal.`
        ); //
      }
    }
  } catch (error) {
    console.error(
      `Error removing watched movie ${movieId} from Firestore:`,
      error
    ); //
    throw error;
  }
};
