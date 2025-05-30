// context/AuthContext.tsx
import { auth } from "@/config/firebaseConfig";
import { createUserProfile } from "@/services/fireStoreService"; // Import createUserProfile
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
  error: Error | null; // General auth error
  signIn: (email: string, pass: string) => Promise<User | null>;
  signUp: (
    email: string,
    pass: string,
    username: string
  ) => Promise<User | null>; // Added username
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
      return userCredential.user;
    } catch (e: any) {
      setError(e); // Firebase Auth errors have a 'message' property
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    pass: string,
    username: string
  ): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
      if (userCredential.user) {
        // After creating the user in Auth, create the profile in Firestore
        const profileResult = await createUserProfile(
          userCredential.user.uid,
          email,
          username
        );
        if (!profileResult.success) {
          // If profile creation fails (e.g., username taken), set error
          // Optionally, delete the auth user to allow re-registration with a different username
          // await userCredential.user.delete(); // Consider this for cleaner UX
          setError(
            new Error(profileResult.message || "Failed to set up user profile.")
          );
          setUser(null); // Ensure user is not set in context if profile fails
          return null;
        }
        setUser(userCredential.user); // Set user in context only if everything succeeds
        return userCredential.user;
      }
      return null; // Should not happen if createUserWithEmailAndPassword succeeds
    } catch (e: any) {
      setError(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
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
