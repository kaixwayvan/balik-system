import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current session immediately
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        setLoading(false);
      }
    };

    const fetchProfile = async (currentUser) => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", currentUser.id)
          .single();

        if (!error && data) {
          currentUser.user_metadata = {
            ...currentUser.user_metadata,
            full_name: data.full_name,
          };
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setUser(currentUser);
        setLoading(false);
      }
    };

    initAuth();

    // 2. Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          if (session?.user) await fetchProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []); // Run only once on mount

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be within AuthProvider");
  return context;
};
