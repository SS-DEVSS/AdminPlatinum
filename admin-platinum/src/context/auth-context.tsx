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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkZjc5MzJhLTdiMDEtNDMyZS1hZjc3LTk2NDljYTE2ZThhYiIsIm5hbWUiOiJTZWJhc3RpYW4gRmxvcmVzIiwicm9sZSI6IjFhY2FhNDdlLWYyMjktNDgwYy04MGVhLWM4MmE3NjI5MDk1YiIsInJhbmRvbUhhc2giOiI5NDQ2ZGFlNS05NzZjLTRkZjYtYWNkMS1hM2YxZDQ3MTY4NjAiLCJpYXQiOjE3MzY2ODI4NDIsImV4cCI6MTczNjcxMjg0Mn0.erkqgo_RW8LnWzVaq9k_KT1JZFO9aaP55MKlyHl9wGs",
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
