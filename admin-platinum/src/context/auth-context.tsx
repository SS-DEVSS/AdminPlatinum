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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVhOTRkYWVkLWUxMTMtNGI5ZS1iMGFmLTMwZDRkZTc1YTgzMiIsIm5hbWUiOiJTZWJhc3RpYW4gRmxvcmVzIiwicm9sZSI6IjI3YzAzMzRkLTIwZjYtNDRkMS1iZTExLWFkZWYzNTE3ZGI0YiIsInJhbmRvbUhhc2giOiI1YjE5YjAxZi1mZjYwLTQ5YTEtODM2My0wNjUwOWFiYThhOTgiLCJpYXQiOjE3Mzc1MjQ2ODAsImV4cCI6MTczNzU1NDY4MH0.LudJZue4VM0gPZlgOwQOOWEX1bMoazGSItn-u6kVPRk",
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
