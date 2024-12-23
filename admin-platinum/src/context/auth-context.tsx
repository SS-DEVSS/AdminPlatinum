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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZmUwYjMwLTI4NmUtNGQ5YS05OTBiLTZiNzJlZGM0NDQwOCIsIm5hbWUiOiJTZWJhc3RpYW4gRmxvcmVzIiwicm9sZSI6IjlkOGNkZmFmLTU0MzItNGY3Yy1hYzBiLTRmYTJmYmM3MWQ5MCIsInJhbmRvbUhhc2giOiI5YTI0NDM2OC1kNTVhLTQ5YmQtOTA1ZS0zYWZiZDI3MDRjNTYiLCJpYXQiOjE3MzQ5MTUwMjMsImV4cCI6MTczNDk0NTAyM30.mFSxPgRcOSslslXWLlms8DByppXCFPrI8pF4HyOgd84",
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
