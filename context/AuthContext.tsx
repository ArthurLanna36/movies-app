import { auth } from "@/config/firebaseConfig";
import {
  User,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  signIn: (email: string, pass: string) => Promise<User | null>;
  signUp: (email: string, pass: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const signIn = async (email: string, pass: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pass
      );
      setUser(userCredential.user);
      setIsLoading(false);
      return userCredential.user;
    } catch (e: any) {
      setError(e);
      setIsLoading(false);
      return null;
    }
  };

  const signUp = async (email: string, pass: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
      setUser(userCredential.user);
      setIsLoading(false);
      return userCredential.user;
    } catch (e: any) {
      setError(e);
      setIsLoading(false);
      return null;
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (e: any) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, signIn, signUp, signOut, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
