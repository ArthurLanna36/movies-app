// services/fireStoreService.ts
import { Movie } from "@/constants/MovieData";
import {
  arrayRemove,
  arrayUnion,
  collection, // Added for querying users collection
  doc,
  getDoc,
  getDocs, // Added for querying users collection
  query, // Added for querying users collection
  setDoc,
  updateDoc,
  where, // Added for querying users collection
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

/**
 * Saves the current list of wheel movies for a specific user.
 * If a list already exists, it will be replaced.
 * @param userId - The ID of the authenticated user.
 * @param movies - The array of movies to save.
 */
export const saveWheelMoviesToFirestore = async (
  userId: string,
  movies: Movie[]
): Promise<void> => {
  if (!userId) throw new Error("User ID is required to save wheel movies.");
  try {
    const wheelDocRef = doc(db, "userRoulettes", userId); // Path uses userId
    await setDoc(wheelDocRef, { movies: movies, lastUpdated: new Date() });
    console.log(`Wheel list saved to Firestore for user: ${userId}!`);
  } catch (error) {
    console.error("Error saving Wheel list to Firestore:", error);
    throw error;
  }
};

/**
 * Loads the wheel movies list from Firestore for a specific user.
 * @param userId - The ID of the authenticated user.
 * @returns A promise that resolves to an array of Movie objects.
 */
export const loadWheelMoviesFromFirestore = async (
  userId: string
): Promise<Movie[]> => {
  if (!userId) {
    console.log("No user ID provided, returning empty wheel list.");
    return [];
  }
  try {
    const wheelDocRef = doc(db, "userRoulettes", userId); // Path uses userId
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

/**
 * Clears the wheel movies list in Firestore for a specific user.
 * @param userId - The ID of the authenticated user.
 */
export const clearWheelMoviesInFirestore = async (
  userId: string
): Promise<void> => {
  if (!userId) throw new Error("User ID is required to clear wheel movies.");
  console.log(
    `fireStoreService: clearWheelMoviesInFirestore initiated for user ${userId}.`
  );
  try {
    const wheelDocRef = doc(db, "userRoulettes", userId); // Path uses userId
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

/**
 * Removes a specific movie from the wheel list in Firestore for a specific user.
 * @param userId - The ID of the authenticated user.
 * @param movieId - The ID of the movie to remove.
 */
export const removeSingleMovieFromFirestore = async (
  userId: string,
  movieId: string
): Promise<void> => {
  if (!userId) throw new Error("User ID is required to remove a movie.");
  try {
    const wheelDocRef = doc(db, "userRoulettes", userId); // Path uses userId
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

/**
 * Saves a single movie to the watched list in Firestore for a specific user.
 * Avoids duplicates based on movie ID.
 * @param userId - The ID of the authenticated user.
 * @param movie - The Movie object to add.
 */
export const addWatchedMovieToFirestore = async (
  userId: string,
  movie: Movie
): Promise<void> => {
  if (!userId) throw new Error("User ID is required to add a watched movie.");
  try {
    const watchedDocRef = doc(db, "userWatchedMovies", userId); // Path uses userId
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

/**
 * Loads the watched movies list from Firestore for a specific user.
 * @param userId - The ID of the authenticated user.
 * @returns A promise that resolves to an array of Movie objects.
 */
export const loadWatchedMoviesFromFirestore = async (
  userId: string
): Promise<Movie[]> => {
  if (!userId) {
    console.log("No user ID provided, returning empty watched list.");
    return [];
  }
  try {
    const watchedDocRef = doc(db, "userWatchedMovies", userId); // Path uses userId
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

/**
 * Removes a specific movie from the watched list in Firestore for a specific user.
 * @param userId - The ID of the authenticated user.
 * @param movieId - The ID of the movie to remove.
 */
export const removeWatchedMovieFromFirestore = async (
  userId: string,
  movieId: string
): Promise<void> => {
  if (!userId)
    throw new Error("User ID is required to remove a watched movie.");
  try {
    const watchedDocRef = doc(db, "userWatchedMovies", userId); // Path uses userId
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

/**
 * Creates a user profile document in Firestore.
 * Checks if the username is already taken (case-insensitive).
 * @param userId - The Firebase Auth UID.
 * @param email - The user's email.
 * @param username - The desired username.
 * @returns A promise resolving to an object with success status and optional message.
 */
export const createUserProfile = async (
  userId: string,
  email: string,
  username: string
): Promise<{ success: boolean; message?: string }> => {
  if (!userId || !email || !username) {
    return {
      success: false,
      message: "User ID, email, and username are required.",
    };
  }

  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("username_lowercase", "==", username.toLowerCase())
  );

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return {
        success: false,
        message: "Username already taken. Please choose another one.",
      };
    }

    const userProfileDocRef = doc(db, "users", userId);
    await setDoc(userProfileDocRef, {
      email: email,
      username: username,
      username_lowercase: username.toLowerCase(), // For case-insensitive unique checks
      createdAt: new Date(),
    });
    console.log(
      `User profile created for user: ${userId} with username: ${username}`
    );
    return { success: true };
  } catch (error) {
    console.error("Error creating user profile:", error);
    return {
      success: false,
      message: "Error creating user profile. Please try again.",
    };
  }
};
