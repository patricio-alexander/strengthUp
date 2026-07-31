import { useState, useEffect } from "react";
import { AuthError } from "@/src/features/auth/domain/auth-error";
import { loginUseCase } from "@/src/di/container";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const useLoginWithGoogle = () => {
  const [error, setError] = useState<string | null>(null);
  const signIn = async () => {
    setError(null);

    try {
      await loginUseCase.loginWithGoogle();
    } catch (error: AuthError | any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_CLIENT_ID_WEB,
    });
  }, []);

  return { signIn, error };
};
