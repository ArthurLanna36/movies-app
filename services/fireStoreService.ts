// services/firestoreService.ts
import { Movie } from '@/constants/MovieData';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig'; // Importe a instância 'db' configurada

// Para simplificar, vamos assumir um ID de usuário/dispositivo fixo por enquanto.
// Em um app real, isso viria da autenticação ou de um ID de dispositivo único.
const USER_DEVICE_ID = "defaultUserWheel"; // Poderia ser gerado e salvo no AsyncStorage

/**
 * Salva a lista atual de filmes da roleta para o usuário/dispositivo.
 * Se já existir uma lista, ela será substituída.
 */
export const saveWheelMoviesToFirestore = async (movies: Movie[]): Promise<void> => {
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
      console.log("Lista da roleta carregada do Firestore:", docSnap.data().movies);
      return docSnap.data().movies as Movie[];
    } else {
      console.log("Nenhuma lista da roleta encontrada no Firestore para este usuário.");
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
    try {
        const wheelDocRef = doc(db, "userRoulettes", USER_DEVICE_ID);
        // Opção 1: Remover o documento inteiro (se o usuário não tiver outras configurações de roleta)
        // await deleteDoc(wheelDocRef);

        // Opção 2: Apenas limpar a lista de filmes dentro do documento
        await setDoc(wheelDocRef, { movies: [], lastUpdated: new Date() }, { merge: true });
        console.log("Lista da roleta limpa no Firestore!");
    } catch (error) {
        console.error("Erro ao limpar lista da roleta no Firestore:", error);
        throw error;
    }
};

// No futuro, você poderia expandir com:
// - addSingleMovieToFirestoreList(movie: Movie) -> usando arrayUnion
// - removeSingleMovieFromFirestoreList(movieId: string) -> usando arrayRemove