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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkZjc5MzJhLTdiMDEtNDMyZS1hZjc3LTk2NDljYTE2ZThhYiIsIm5hbWUiOiJTZWJhc3RpYW4gRmxvcmVzIiwicm9sZSI6IjFhY2FhNDdlLWYyMjktNDgwYy04MGVhLWM4MmE3NjI5MDk1YiIsInJhbmRvbUhhc2giOiIyODVkZDU1MC00MGY5LTQ5ZGUtOTRhMy1lMTNlM2U0YTFjY2YiLCJpYXQiOjE3MzY4MTY0NDcsImV4cCI6MTczNjg0NjQ0N30.d501WdTpkKziNxS2SSOFJs5H_alPqi3iW8myTDFGuT8",
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
