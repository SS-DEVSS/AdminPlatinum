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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNiODc2NmZjLTE2ZDUtNGIyYi1hNzdhLTFkM2Q4OGE4MmMxNCIsIm5hbWUiOiJTZWJhc3RpYW4gRmxvcmVzIiwicm9sZSI6IjAxOTQxNjllLWYyODktNDdjZC1iMTA1LWQ0OTk5ZmYwMTJlMSIsInJhbmRvbUhhc2giOiI5MTcxMDllMy1jMGY4LTRlMGUtYWUzNS0wNzM0MzY1MzgwMDIiLCJpYXQiOjE3Mzc4ODgxMzYsImV4cCI6MTczNzkxODEzNn0.H1UlBgKMmRWLwUnEJ7_qethnsekBGvJmGntK-vgOtGM",
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
