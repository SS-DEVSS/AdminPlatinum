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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEzYzUxNWI0LWYwZmYtNDhhYS05NDFmLTk5NWQ2MjBlNzBkZSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6IjY1ZDI0NzliLTEwN2MtNDllNS05YzlhLWUxMDRhMDkyNGY0NCIsInJhbmRvbUhhc2giOiI2MDNhYmY3MC01YTk5LTRkMzItODAwYy0zMzU1MTA4YzFlM2EiLCJpYXQiOjE3NjUyMzIxMjcsImV4cCI6MTc2NTIzMjQyN30.lTe16MnM8NfKeBCSGygOZRd99tjsNwrMXRh5xK9q2Qg"
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
