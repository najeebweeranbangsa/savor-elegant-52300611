import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthCtx {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [checkingRole, setCheckingRole] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession?.user) {
        setIsAdmin(false);
        setCheckingRole(false);
      }
      setInitializing(false);
    });

    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        setSession(currentSession);
        if (!currentSession?.user) {
          setIsAdmin(false);
          setCheckingRole(false);
        }
      })
      .finally(() => {
        setInitializing(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!session?.user?.id) {
      setIsAdmin(false);
      setCheckingRole(false);
      return;
    }

    const resolveAdminRole = async (userId: string) => {
      setCheckingRole(true);

      const timeoutId = window.setTimeout(() => {
        if (!cancelled) {
          setIsAdmin(false);
          setCheckingRole(false);
        }
      }, 8000);

      try {
        const { data, error } = await supabase.rpc("has_role", {
          _user_id: userId,
          _role: "admin",
        });

        if (cancelled) return;
        setIsAdmin(!error && !!data);
      } catch {
        if (!cancelled) setIsAdmin(false);
      } finally {
        window.clearTimeout(timeoutId);
        if (!cancelled) setCheckingRole(false);
      }
    };

    resolveAdminRole(session.user.id);

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setCheckingRole(false);
  };

  const loading = useMemo(
    () => initializing || (!!session?.user && checkingRole),
    [initializing, checkingRole, session?.user],
  );

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
