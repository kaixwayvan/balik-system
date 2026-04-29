import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../../utils/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef(null);

  // Sync ref with state
  useEffect(() => {
    userRef.current = user;
  }, [user]);

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
        // Try to fetch existing profile
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        let profileData = data;

        // If profile doesn't exist or is missing critical info, sync it from metadata
        if (error || !data) {
          console.log("Profile missing or error, syncing from metadata...");
          const { data: syncedData, error: syncError } = await supabase
            .from("profiles")
            .upsert({
              id: currentUser.id,
              full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name,
              mobile_number: currentUser.user_metadata?.mobile_number || currentUser.user_metadata?.contact,
              email: currentUser.email,
              role: currentUser.user_metadata?.role || 'user',
              updated_at: new Date(),
            })
            .select()
            .single();

          if (!syncError) {
            profileData = syncedData;
          }
        }

        if (profileData) {
          currentUser.user_metadata = {
            ...currentUser.user_metadata,
            full_name: profileData.full_name,
            role: profileData.role || currentUser.user_metadata?.role || 'user',
          };
        }
      } catch (err) {
        console.error("Profile sync/fetch error:", err);
      } finally {
        setUser(currentUser);
        setLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth Event: ${event}`);

        if (session?.user) {
          // Use userRef.current to avoid stale closure
          const currentUser = userRef.current;
          
          // Only fetch profile if it's a new user or a SIGNED_IN event
          // TOKEN_REFRESHED events for the same user are ignored to avoid redundant re-renders
          if (!currentUser || currentUser.id !== session.user.id || event === 'SIGNED_IN') {
            console.log("Performing full profile fetch/sync...");
            await fetchProfile(session.user);
          } else {
            // Keep the user object updated but avoid triggering a state change if ID is same
            // This prevents focus-triggered "refreshing" loops
            console.log("Skipping redundant profile fetch on token refresh/focus");
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (!session && event !== 'INITIAL_SESSION') {
          setUser(null);
          setLoading(false);
        }
      }
    );

    initAuth();

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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be within AuthProvider");
  return context;
};
