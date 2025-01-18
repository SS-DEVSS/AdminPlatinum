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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkZjc5MzJhLTdiMDEtNDMyZS1hZjc3LTk2NDljYTE2ZThhYiIsIm5hbWUiOiJTZWJhc3RpYW4gRmxvcmVzIiwicm9sZSI6IjFhY2FhNDdlLWYyMjktNDgwYy04MGVhLWM4MmE3NjI5MDk1YiIsInJhbmRvbUhhc2giOiI2MmYwMGUyNi03YzJmLTRjM2YtYWQyNS05NGE2MDhlYTNlNWMiLCJpYXQiOjE3MzcxNjc0NjUsImV4cCI6MTczNzE5NzQ2NX0.UylkY0EBMmODjqAieBkm_VKjU1l1FjFhv0tgp28RGOA",
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
