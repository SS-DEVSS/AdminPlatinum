import { ReactNode, useState, useContext, createContext, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextTypes {
  isAuthenticated: boolean;
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<{
  authState: AuthContextTypes;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}>({} as any);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthContextTypes>({
    isAuthenticated: false,
    session: null,
    user: null,
    loading: true,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        isAuthenticated: !!session,
        session,
        user: session?.user ?? null,
        loading: false,
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
