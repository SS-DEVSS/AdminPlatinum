import { ReactNode } from "react";
import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

interface AuthContextTypes {
  isAuthenticated: boolean;
  authKey: string;
}

const AuthContext = createContext<{
  authState: AuthContextTypes;
  authenticate: (authKey: string) => void;
}>({} as any);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthContextTypes>({
    isAuthenticated: true,
    authKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZmUwYjMwLTI4NmUtNGQ5YS05OTBiLTZiNzJlZGM0NDQwOCIsIm5hbWUiOiJTZWJhc3RpYW4gRmxvcmVzIiwicm9sZSI6IjlkOGNkZmFmLTU0MzItNGY3Yy1hYzBiLTRmYTJmYmM3MWQ5MCIsInJhbmRvbUhhc2giOiIwZDU5NTRhNC0yZGZmLTRkZDEtOGZlMC1iNzdiZjExN2Q1M2UiLCJpYXQiOjE3MzQ5NDUzMTAsImV4cCI6MTczNDk3NTMxMH0.WoyObCCp1dALU8epIS3wBbpcWj6rCOtpSgoDuj36v_E",
  });

  const authenticate = (authKey: string) => {
    setAuthState({
      isAuthenticated: true,
      authKey,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, authenticate }}>
      {children}
    </AuthContext.Provider>
  );
};
