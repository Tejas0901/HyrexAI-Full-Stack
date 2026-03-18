import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { CreateUser, LoginUser } from "@/types";

export function useAuthForm() {
  const { signIn, signUp, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = useCallback(
    async (data: LoginUser) => {
      setLocalError(null);
      clearError();

      try {
        await signIn(data);
        navigate("/");
      } catch (err) {
        const message =
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail || "Login failed. Please try again.";
        setLocalError(message);
      }
    },
    [signIn, navigate, clearError]
  );

  const handleRegister = useCallback(
    async (data: CreateUser) => {
      setLocalError(null);
      clearError();

      try {
        await signUp(data);
        navigate("/");
      } catch (err) {
        const message =
          (err as { response?: { data?: { detail?: string } } })?.response?.data
            ?.detail || "Registration failed. Please try again.";
        setLocalError(message);
      }
    },
    [signUp, navigate, clearError]
  );

  return {
    handleLogin,
    handleRegister,
    isLoading,
    error: error || localError,
    clearError: () => {
      setLocalError(null);
      clearError();
    },
  };
}

export default useAuthForm;
