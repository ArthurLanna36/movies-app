// services/firestoreService.ts
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

const USER_DEVICE_ID = "defaultUserWheel";
const WATCHED_MOVIES_DOC_ID = "defaultUserWatched";

/**
 * Salva a lista atual de filmes da roleta para o usuário/dispositivo.
 * Se já existir uma lista, ela será substituída.
 */
export const saveWheelMoviesToFirestore = async (
  movies: Movie[]
): Promise<void> => {
  try {
    const wheelDocRef = doc(db, "userRoulettes", USER_DEVICE_ID);
    await setDoc(wheelDocRef, { movies: movies, lastUpdated: new Date() });
    console.log("Lista da roleta salva no Firestore!");
  } catch (error) {
    console.error("Erro ao salvar lista da roleta no Firestore:", error);
    throw error; // Relança o erro para ser tratado pelo chamador
  }
};

/**
 * Carrega a lista de filmes da roleta do Firestore para o usuário/dispositivo.
 */
export const loadWheelMoviesFromFirestore = async (): Promise<Movie[]> => {
  try {
    const wheelDocRef = doc(db, "userRoulettes", USER_DEVICE_ID);
    const docSnap = await getDoc(wheelDocRef);

    if (docSnap.exists()) {
      console.log(
        "Lista da roleta carregada do Firestore:",
        docSnap.data().movies
      );
      return docSnap.data().movies as Movie[];
    } else {
      console.log(
        "Nenhuma lista da roleta encontrada no Firestore para este usuário."
      );
      return []; // Retorna lista vazia se não houver dados salvos
    }
  } catch (error) {
    console.error("Erro ao carregar lista da roleta do Firestore:", error);
    throw error;
  }
};

/**
 * Limpa a lista de filmes da roleta no Firestore para o usuário/dispositivo.
 * (Poderia ser implementado removendo o documento ou definindo o array movies como vazio)
 */
export const clearWheelMoviesInFirestore = async (): Promise<void> => {
  console.log("fireStoreService: clearWheelMoviesInFirestore iniciada."); // NOVO LOG
  try {
    const wheelDocRef = doc(db, "userRoulettes", USER_DEVICE_ID);
    console.log("fireStoreService: Documento de referência:", wheelDocRef.path); // NOVO LOG
    await setDoc(
      wheelDocRef,
      { movies: [], lastUpdated: new Date() },
      { merge: true }
    );
    console.log("Lista da roleta limpa no Firestore!"); // Este log é importante
  } catch (error) {
    console.error("Erro ao limpar lista da roleta no Firestore:", error); // Verifique este erro
    throw error;
  }
};

/**
 * Remove um filme específico da lista da roleta no Firestore.
 */
export const removeSingleMovieFromFirestore = async (
  movieId: string
): Promise<void> => {
  try {
    const wheelDocRef = doc(db, "userRoulettes", USER_DEVICE_ID);
    // Para remover um item de um array, precisamos do objeto completo ou de um campo único para identificá-lo.
    // Se você salvou a lista de Movie[], e Movie tem um 'id' único:
    // Primeiro, precisamos buscar o documento para encontrar o objeto do filme.
    const docSnap = await getDoc(wheelDocRef);
    if (docSnap.exists()) {
      const movies = docSnap.data().movies as Movie[];
      const movieToRemove = movies.find((movie) => movie.id === movieId);
      if (movieToRemove) {
        await updateDoc(wheelDocRef, {
          movies: arrayRemove(movieToRemove), // arrayRemove precisa do objeto exato
          lastUpdated: new Date(),
        });
        console.log(`Filme com ID ${movieId} removido do Firestore!`);
      } else {
        console.warn(
          `Filme com ID ${movieId} não encontrado no Firestore para remoção.`
        );
      }
    }
  } catch (error) {
    console.error(`Erro ao remover filme ${movieId} do Firestore:`, error);
    throw error;
  }
};

/**
 * Salva um único filme na lista de assistidos no Firestore.
 * Evita duplicados baseado no ID do filme.
 */
export const addWatchedMovieToFirestore = async (
  movie: Movie
): Promise<void> => {
  try {
    const watchedDocRef = doc(db, "userWatchedMovies", WATCHED_MOVIES_DOC_ID);
    // Usar arrayUnion para adicionar apenas se não existir, ou set com merge e verificação manual
    // Para evitar duplicatas e ter mais controle, vamos buscar, verificar e então atualizar/adicionar.

    const docSnap = await getDoc(watchedDocRef);
    if (docSnap.exists()) {
      const existingMovies = docSnap.data().movies as Movie[];
      if (!existingMovies.find((m) => m.id === movie.id)) {
        await updateDoc(watchedDocRef, {
          movies: arrayUnion(movie), // Adiciona o filme ao array se não existir
          lastUpdated: new Date(),
        });
        console.log("Filme adicionado à lista de assistidos no Firestore!");
      } else {
        console.log("Filme já existe na lista de assistidos do Firestore.");
      }
    } else {
      // Se o documento não existe, cria com o primeiro filme
      await setDoc(watchedDocRef, { movies: [movie], lastUpdated: new Date() });
      console.log(
        "Lista de assistidos criada com o primeiro filme no Firestore!"
      );
    }
  } catch (error) {
    console.error(
      "Erro ao adicionar filme à lista de assistidos no Firestore:",
      error
    );
    throw error;
  }
};

/**
 * Carrega a lista de filmes assistidos do Firestore.
 */
export const loadWatchedMoviesFromFirestore = async (): Promise<Movie[]> => {
  try {
    const watchedDocRef = doc(db, "userWatchedMovies", WATCHED_MOVIES_DOC_ID);
    const docSnap = await getDoc(watchedDocRef);

    if (docSnap.exists()) {
      console.log(
        "Lista de assistidos carregada do Firestore:",
        docSnap.data().movies
      );
      return (docSnap.data().movies as Movie[]).sort((a, b) =>
        a.title.localeCompare(b.title)
      ); // Ordena aqui
    } else {
      console.log("Nenhuma lista de assistidos encontrada no Firestore.");
      return [];
    }
  } catch (error) {
    console.error("Erro ao carregar lista de assistidos do Firestore:", error);
    throw error;
  }
};

/**
 * Remove um filme específico da lista de assistidos no Firestore.
 */
export const removeWatchedMovieFromFirestore = async (
  movieId: string
): Promise<void> => {
  try {
    const watchedDocRef = doc(db, "userWatchedMovies", WATCHED_MOVIES_DOC_ID);
    const docSnap = await getDoc(watchedDocRef);

    if (docSnap.exists()) {
      const movies = docSnap.data().movies as Movie[];
      const movieToRemove = movies.find((movie) => movie.id === movieId);
      if (movieToRemove) {
        await updateDoc(watchedDocRef, {
          movies: arrayRemove(movieToRemove),
          lastUpdated: new Date(),
        });
        console.log(`Filme assistido com ID ${movieId} removido do Firestore!`);
      } else {
        console.warn(
          `Filme assistido com ID ${movieId} não encontrado no Firestore para remoção.`
        );
      }
    }
  } catch (error) {
    console.error(
      `Erro ao remover filme assistido ${movieId} do Firestore:`,
      error
    );
    throw error;
  }
};
