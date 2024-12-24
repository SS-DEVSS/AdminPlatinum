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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZmUwYjMwLTI4NmUtNGQ5YS05OTBiLTZiNzJlZGM0NDQwOCIsIm5hbWUiOiJTZWJhc3RpYW4gRmxvcmVzIiwicm9sZSI6IjlkOGNkZmFmLTU0MzItNGY3Yy1hYzBiLTRmYTJmYmM3MWQ5MCIsInJhbmRvbUhhc2giOiJlNDFiYjAwMS01YzNhLTQwYTAtODQyNy1jMDllZmQyNGRkMGYiLCJpYXQiOjE3MzUwMTE1NzAsImV4cCI6MTczNTA0MTU3MH0.wdXb5-rkvjraOEoa8gkGAeFdwiXVnK2XsRZfdddAVPM",
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
