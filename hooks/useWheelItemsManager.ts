// hooks/useWheelItemsManager.ts
import { Movie } from '@/constants/MovieData';
import { clearWheelMoviesInFirestore, loadWheelMoviesFromFirestore, removeSingleMovieFromFirestore, saveWheelMoviesToFirestore } from '@/services/fireStoreService'; // NOVOS IMPORTS
import { searchMovieByTitle } from '@/services/tmdbService';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

interface UseWheelItemsManagerReturn {
  wheelMovies: Movie[];
  addMovieToWheel: (title: string) => Promise<Movie | null>;
  removeMovieById: (movieId: string) => Promise<void>;
  clearWheel: () => Promise<void>;
  isLoadingItems: boolean;
  isSavingItems: boolean;
  isLoadingMovie: boolean;
  isRemovingMovie: boolean;
  errorLoadingItems: Error | null;
  errorSavingItems: Error | null;
  errorAddingMovie: Error | null;
  errorRemovingMovie: Error | null;
}

const MAX_WHEEL_ITEMS = 10;

export function useWheelItemsManager(): UseWheelItemsManagerReturn {
  const [wheelMovies, setWheelMovies] = useState<Movie[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState<boolean>(true);
  const [isSavingItems, setIsSavingItems] = useState<boolean>(false);
  const [isLoadingMovie, setIsLoadingMovie] = useState<boolean>(false);
  const [isRemovingMovie, setIsRemovingMovie] = useState<boolean>(false); // Novo
  const [errorLoadingItems, setErrorLoadingItems] = useState<Error | null>(null);
  const [errorSavingItems, setErrorSavingItems] = useState<Error | null>(null);
  const [errorAddingMovie, setErrorAddingMovie] = useState<Error | null>(null);
  const [errorRemovingMovie, setErrorRemovingMovie] = useState<Error | null>(null); // Novo

  // Carregar filmes do Firestore ao iniciar o hook
  useEffect(() => {
    const loadInitialMovies = async () => {
      setIsLoadingItems(true);
      setErrorLoadingItems(null);
      try {
        const loadedMovies = await loadWheelMoviesFromFirestore(); //
        setWheelMovies(loadedMovies);
      } catch (e) {
        console.error("Erro ao carregar filmes iniciais do Firestore:", e);
        setErrorLoadingItems(e instanceof Error ? e : new Error('Falha ao carregar lista salva.'));
      } finally {
        setIsLoadingItems(false);
      }
    };
    loadInitialMovies();
  }, []);

  // Salvar no Firestore sempre que wheelMovies mudar (exceto durante o carregamento inicial)
  useEffect(() => {
    if (!isLoadingItems) { // Modificado para salvar mesmo se a lista estiver vazia (após uma limpeza, por exemplo)
      const saveMovies = async () => {
        // Não acionar salvamento se estivermos no meio de uma remoção que já atualizou o Firestore (se usar removeSingleMovieFromFirestore)
        // Para a abordagem atual (onde o useEffect salva tudo), este isSavingItems é suficiente.
        if (isRemovingMovie) return; // Evita salvar duas vezes se a remoção já atualiza o Firestore

        setIsSavingItems(true);
        setErrorSavingItems(null);
        try {
          await saveWheelMoviesToFirestore(wheelMovies); //
        } catch (e) {
          console.error("Erro ao salvar filmes no Firestore:", e);
          setErrorSavingItems(e instanceof Error ? e : new Error('Falha ao salvar lista.'));
          Alert.alert("Erro", "Não foi possível salvar suas alterações na roleta.");
        } finally {
          setIsSavingItems(false);
        }
      };
      saveMovies();
    }
  }, [wheelMovies, isLoadingItems, isRemovingMovie]); // Adicionado isRemovingMovie para evitar double save

  const addMovieToWheel = useCallback(async (title: string): Promise<Movie | null> => {
    if (wheelMovies.length >= MAX_WHEEL_ITEMS) {
      // Este alerta pode ser mantido como nativo ou também migrado para um Dialog na HomeScreen
      Alert.alert('Roleta Cheia', `Você pode adicionar até ${MAX_WHEEL_ITEMS} filmes.`);
      setErrorAddingMovie(new Error(`A roleta já está cheia (${MAX_WHEEL_ITEMS} filmes).`)); // Manter para lógica interna
      return null;
    }
    setIsLoadingMovie(true);
    setErrorAddingMovie(null);
    try {
      const foundMovie = await searchMovieByTitle(title);
      if (foundMovie) {
        if (wheelMovies.find(movie => movie.id === foundMovie.id)) {
          // AQUI: Setamos o erro que a HomeScreen vai usar para mostrar o Dialog
          const errorMessage = `"${foundMovie.title}" já está na roleta.`;
          setErrorAddingMovie(new Error(errorMessage)); // O hook seta o erro
          // Não vamos mais chamar Alert.alert daqui. A HomeScreen cuidará disso.
          setIsLoadingMovie(false);
          return null; // Indicamos que o filme não foi adicionado
        }
        setWheelMovies(prevMovies => [...prevMovies, foundMovie]);
        setIsLoadingMovie(false);
        return foundMovie;
      } else {
        const errorMessage = `Filme "${title}" não encontrado.`;
        setErrorAddingMovie(new Error(errorMessage));
        // Não vamos mais chamar Alert.alert daqui.
        setIsLoadingMovie(false);
        return null;
      }
    } catch (e) {
      console.error("Erro ao adicionar filme à roleta:", e);
      const errorMessage = e instanceof Error ? e.message : 'Erro desconhecido ao buscar filme.';
      setErrorAddingMovie(new Error(errorMessage));
      // Não vamos mais chamar Alert.alert daqui.
      setIsLoadingMovie(false);
      return null;
    }
  }, [wheelMovies]); // Dependências do useCallback

  const clearWheel = useCallback(async () => {
    // ... (lógica existente)
    setIsSavingItems(true); // Reutilizando isSavingItems para a operação de limpar tudo
    setErrorSavingItems(null);
    try {
      await clearWheelMoviesInFirestore(); //
      setWheelMovies([]);
    } catch (e) {
      setErrorSavingItems(e instanceof Error ? e : new Error('Falha ao limpar a roleta.'));
      Alert.alert("Erro", "Não foi possível limpar a roleta no servidor.");
    } finally {
      setIsSavingItems(false);
    }
  }, []);

  const removeMovieById = useCallback(async (movieId: string) => {
    setErrorRemovingMovie(null);
    setIsRemovingMovie(true);
    try {
      await removeSingleMovieFromFirestore(movieId);
      setWheelMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
      console.log(`Filme ${movieId} removido localmente e do Firestore.`);
    } catch (e) {
      console.error(`Erro ao remover filme ${movieId}:`, e);
      setErrorRemovingMovie(e instanceof Error ? e : new Error('Falha ao remover filme.'));
      Alert.alert("Erro", "Não foi possível remover o filme da roleta.");
      // Se deu erro na remoção do Firestore, pode ser necessário reverter o estado local:
      // A lista original ainda está em `wheelMovies` antes do `setWheelMovies` ser chamado.
      // Poderia recarregar do Firestore:
      // const loadedMovies = await loadWheelMoviesFromFirestore();
      // setWheelMovies(loadedMovies);
    } finally {
      setIsRemovingMovie(false);
    }
  }, []); // Não precisa de wheelMovies nas dependências se o objetivo é apenas disparar a ação

  return {
    wheelMovies,
    addMovieToWheel,
    removeMovieById, // Exportar a nova função
    clearWheel,
    isLoadingItems,
    isSavingItems,
    isLoadingMovie,
    isRemovingMovie, // Exportar novo estado
    errorLoadingItems,
    errorSavingItems,
    errorAddingMovie,
    errorRemovingMovie, // Exportar novo estado
  };
}