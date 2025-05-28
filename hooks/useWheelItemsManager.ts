// hooks/useWheelItemsManager.ts
import { Movie } from '@/constants/MovieData';
import { clearWheelMoviesInFirestore, loadWheelMoviesFromFirestore, saveWheelMoviesToFirestore } from '@/services/fireStoreService'; // NOVOS IMPORTS
import { searchMovieByTitle } from '@/services/tmdbService';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native'; // Para feedback

interface UseWheelItemsManagerReturn {
  wheelMovies: Movie[];
  addMovieToWheel: (title: string) => Promise<Movie | null>;
  clearWheel: () => Promise<void>; // Agora é uma Promise
  isLoadingItems: boolean; // Estado de carregamento para a lista inicial
  isSavingItems: boolean; // Estado de salvamento
  isLoadingMovie: boolean; // Para adição de filme individual
  errorLoadingItems: Error | null;
  errorSavingItems: Error | null;
  errorAddingMovie: Error | null;
}

const MAX_WHEEL_ITEMS = 10;

export function useWheelItemsManager(): UseWheelItemsManagerReturn {
  const [wheelMovies, setWheelMovies] = useState<Movie[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(true); // Começa carregando
  const [isSavingItems, setIsSavingItems] = useState<boolean>(false);
  const [isLoadingMovie, setIsLoadingMovie] = useState<boolean>(false);
  const [errorLoadingItems, setErrorLoadingItems] = useState<Error | null>(null);
  const [errorSavingItems, setErrorSavingItems] = useState<Error | null>(null);
  const [errorAddingMovie, setErrorAddingMovie] = useState<Error | null>(null);

  // Carregar filmes do Firestore ao iniciar o hook
  useEffect(() => {
    const loadInitialMovies = async () => {
      setIsLoadingItems(true);
      setErrorLoadingItems(null);
      try {
        const loadedMovies = await loadWheelMoviesFromFirestore();
        setWheelMovies(loadedMovies);
      } catch (e) {
        console.error("Erro ao carregar filmes iniciais do Firestore:", e);
        setErrorLoadingItems(e instanceof Error ? e : new Error('Falha ao carregar lista salva.'));
        // Pode-se manter a lista vazia ou carregar placeholders como fallback
      } finally {
        setIsLoadingItems(false);
      }
    };
    loadInitialMovies();
  }, []);

  // Salvar no Firestore sempre que wheelMovies mudar
  useEffect(() => {
    // Não salvar na montagem inicial se estivermos carregando
    if (!isLoadingItems && wheelMovies.length > 0) { // Ou alguma outra condição para evitar salvar lista vazia se não for intenção
      const saveMovies = async () => {
        setIsSavingItems(true);
        setErrorSavingItems(null);
        try {
          await saveWheelMoviesToFirestore(wheelMovies);
        } catch (e) {
          console.error("Erro ao salvar filmes no Firestore:", e);
          setErrorSavingItems(e instanceof Error ? e : new Error('Falha ao salvar lista.'));
          Alert.alert("Erro", "Não foi possível salvar suas alterações na roleta.");
        } finally {
          setIsSavingItems(false);
        }
      };
      saveMovies();
    } else if (!isLoadingItems && wheelMovies.length === 0) {
        // Se a intenção é limpar e a lista está vazia após o carregamento inicial,
        // podemos querer chamar clearWheelMoviesInFirestore ou uma lógica específica
        // Aqui, vamos apenas evitar salvar uma lista vazia automaticamente, a menos que seja uma ação explícita de 'clearWheel'.
    }
  }, [wheelMovies, isLoadingItems]);


  const addMovieToWheel = useCallback(async (title: string): Promise<Movie | null> => {
    if (wheelMovies.length >= MAX_WHEEL_ITEMS) {
      Alert.alert('Roleta Cheia', `Você pode adicionar até ${MAX_WHEEL_ITEMS} filmes.`);
      setErrorAddingMovie(new Error(`A roleta já está cheia (${MAX_WHEEL_ITEMS} filmes).`));
      return null;
    }
    // ... (lógica de busca do TMDB como antes) ...
    setIsLoadingMovie(true);
    setErrorAddingMovie(null);
    try {
      const foundMovie = await searchMovieByTitle(title);
      if (foundMovie) {
        if (wheelMovies.find(movie => movie.id === foundMovie.id)) {
          setErrorAddingMovie(new Error(`"${foundMovie.title}" já está na roleta.`));
           Alert.alert('Filme Repetido', `"${foundMovie.title}" já está na roleta.`);
          setIsLoadingMovie(false);
          return null;
        }
        // Atualiza o estado local, o useEffect acima cuidará de salvar no Firestore
        setWheelMovies(prevMovies => [...prevMovies, foundMovie]);
        setIsLoadingMovie(false);
        return foundMovie;
      } else {
        setErrorAddingMovie(new Error(`Filme "${title}" não encontrado.`));
        Alert.alert('Não Encontrado', `Não conseguimos encontrar o filme "${title}". Tente outro título.`);
        setIsLoadingMovie(false);
        return null;
      }
    } catch (e) {
      console.error("Erro ao adicionar filme à roleta:", e);
      setErrorAddingMovie(e instanceof Error ? e : new Error('Erro desconhecido ao buscar filme.'));
      Alert.alert('Erro na Busca', 'Ocorreu um problema ao buscar o filme. Tente novamente.');
      setIsLoadingMovie(false);
      return null;
    }
  }, [wheelMovies]); // Adicionado wheelMovies como dependência

  const clearWheel = useCallback(async () => {
  console.log("useWheelItemsManager: clearWheel iniciada."); // NOVO LOG
  setIsSavingItems(true);
  setErrorSavingItems(null);
  try {
    console.log("useWheelItemsManager: Chamando clearWheelMoviesInFirestore..."); // NOVO LOG
    await clearWheelMoviesInFirestore();
    console.log("useWheelItemsManager: clearWheelMoviesInFirestore concluída. Chamando setWheelMovies([])."); // NOVO LOG
    setWheelMovies([]);
  } catch (e) {
    console.error("useWheelItemsManager: Erro em clearWheel:", e); // NOVO LOG
    setErrorSavingItems(e instanceof Error ? e : new Error('Falha ao limpar a roleta.'));
    Alert.alert("Erro", "Não foi possível limpar a roleta no servidor.");
  } finally {
    setIsSavingItems(false);
    console.log("useWheelItemsManager: clearWheel finalizada."); // NOVO LOG
  }
}, []);

  return {
    wheelMovies,
    addMovieToWheel,
    clearWheel,
    isLoadingItems,
    isSavingItems,
    isLoadingMovie,
    errorLoadingItems,
    errorSavingItems,
    errorAddingMovie
  };
}