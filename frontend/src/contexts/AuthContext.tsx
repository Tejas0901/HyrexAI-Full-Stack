import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { authApi } from "@/services/auth";
import type { User, CreateUser, LoginUser, TokenResponse } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signUp: (data: CreateUser) => Promise<void>;
  signIn: (data: LoginUser) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("hyrex_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store tokens and user data
  const setAuthData = useCallback((data: TokenResponse) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("hyrex_user", JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  // Sign up new user
  const signUp = useCallback(
    async (data: CreateUser) => {
      setIsLoading(true);
      setError(null);

      try {
        await authApi.register(data);
        // After registration, automatically log in
        const tokenData = await authApi.login({
          email: data.email,
          password: data.password,
        });
        setAuthData(tokenData);
      } catch (err) {
        const message =
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail || "Registration failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setAuthData],
  );

  // Sign in existing user
  const signIn = useCallback(
    async (data: LoginUser) => {
      setIsLoading(true);
      setError(null);

      try {
        const tokenData = await authApi.login(data);
        setAuthData(tokenData);
      } catch (err) {
        const message =
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail || "Login failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setAuthData],
  );

  // Sign out
  const signOut = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const userData = await authApi.getCurrentUser();
      localStorage.setItem("hyrex_user", JSON.stringify(userData));
      setUser(userData);
    } catch {
      // Token might be invalid, clear auth
      signOut();
    }
  }, [signOut]);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      refreshUser();
    }
  }, [user, refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        signUp,
        signIn,
        signOut,
        clearError,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
