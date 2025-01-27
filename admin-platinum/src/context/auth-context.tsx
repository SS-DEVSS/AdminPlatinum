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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiODc2NmZjLTE2ZDUtNGIyYi1hNzdhLTFkM2Q4OGE4MmMxNCIsIm5hbWUiOiJTZWJhc3RpYW4gRmxvcmVzIiwicm9sZSI6IjAxOTQxNjllLWYyODktNDdjZC1iMTA1LWQ0OTk5ZmYwMTJlMSIsInJhbmRvbUhhc2giOiJmY2Q2NDQ0MC01YWIxLTRhZDUtODZlMC1hNTcxZWM5YzE0MGIiLCJpYXQiOjE3Mzc5NDM3NzQsImV4cCI6MTczNzk3Mzc3NH0.hMP8KafA6YwROn0SM1elHStUBuDjW19PaGCdw5NBMGk",
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
