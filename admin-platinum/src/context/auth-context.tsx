import { ReactNode, useState, useContext, createContext, useEffect } from "react";
import { supabase } from "../services/supabase";
import axiosClient from "../services/axiosInstance";
import { Session, User, AuthChangeEvent } from "@supabase/supabase-js";

interface AuthContextTypes {
  isAuthenticated: boolean;
  session: Session | null;
  user: User | null;
  loading: boolean;
}

interface AuthContextValue {
  authState: AuthContextTypes;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  authState: {
    isAuthenticated: false,
    session: null,
    user: null,
    loading: true,
  },
  signIn: async () => { },
  signOut: async () => { },
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthContextTypes>({
    isAuthenticated: false,
    session: null,
    user: null,
    loading: true,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setAuthState({
        isAuthenticated: !!session,
        session,
        user: session?.user ?? null,
        loading: false,
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setAuthState({
        isAuthenticated: !!session,
        session,
        user: session?.user ?? null,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Validate that user exists in Users table
    // The authMiddleware will return 401 if user doesn't exist in Users table
    const client = axiosClient();

    try {
      // Use /users endpoint which requires authMiddleware
      // authMiddleware checks if user exists in Users table - returns 401 if not found
      const response = await client.get("/users", {
        validateStatus: (status) => {
          // Accept 200 (success), 201 (created), 401 (user not found), 403 (no permission)
          return status === 200 || status === 201 || status === 401 || status === 403;
        },
      });

      // If we get 401, it means authMiddleware failed - user doesn't exist in Users table
      if (response.status === 401) {
        await supabase.auth.signOut();
        throw new Error(
          "Usuario no encontrado en el sistema. Por favor contacte al administrador para crear su cuenta."
        );
      }

      // 200/201 means success - user exists
      // 403 means user exists but lacks permission - that's acceptable, user exists
      // In both cases, validation passed and we can proceed
    } catch (validationError: unknown) {
      // If it's an Error with our message, re-throw it immediately
      if (validationError instanceof Error) {
        if (validationError.message.includes("Usuario no encontrado")) {
          throw validationError;
        }
      }

      // Check if it's an axios error with 401 status
      const axiosError = validationError as {
        response?: { status?: number; statusText?: string; data?: unknown };
        message?: string;
        code?: string;
      };

      if (axiosError?.response?.status === 401) {
        await supabase.auth.signOut();
        throw new Error(
          "Usuario no encontrado en el sistema. Por favor contacte al administrador para crear su cuenta."
        );
      }

      // For network errors or other issues, allow login (backend might be temporarily unavailable)
      // Only block if we explicitly get 401
    }

    try {
      const currentUserResponse = await client.get("/users/me");
      const currentUser = currentUserResponse.data;
      
      if (currentUser && currentUser.passwordCreated === false) {
        setAuthState({
          isAuthenticated: !!data.session,
          session: data.session,
          user: data.user,
          loading: false,
        });
        window.location.href = "/create-password";
        return;
      }
    } catch (userError) {
      console.error("Error fetching current user:", userError);
    }

    setAuthState({
      isAuthenticated: !!data.session,
      session: data.session,
      user: data.user,
      loading: false,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthState({
      isAuthenticated: false,
      session: null,
      user: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
