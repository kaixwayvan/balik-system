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

    // 3. Re-check session on window focus (Fixes "tab sleep" issues)
    const handleFocus = async () => {
      console.log("Window focused, checking session...");

      // Just check if we can get a session. If strictly null, do nothing and let onAuthStateChange handle it.
      // We only manually update if we find a Valid session that we didn't know about.
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.warn("Error checking session on focus:", error);
        return;
      }

      if (session?.user) {
        if (!user) {
          console.log("Recovered session on focus");
          await fetchProfile(session.user);
        }
      }
      // Removed the 'else { setUser(null) }' block. 
      // If session is missing here (e.g. strict refresh fail), Supabase will emit SIGNED_OUT event shortly.
      // Forcing it here causes race conditions where the token is just refreshing.
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      subscription?.unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]); // Add user to dependency array so handleFocus sees current user state

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
