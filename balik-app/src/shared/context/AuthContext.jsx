import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../../utils/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef(null);
  const profileFetchedRef = useRef(false);

  // Sync ref with state
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const fetchProfile = useCallback(async (currentUser, isInitial = false) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      let profileData = data;

      if (error || !data) {
        console.log("Profile missing or error, syncing from metadata...");
        const { data: syncedData, error: syncError } = await supabase
          .from("profiles")
          .upsert({
            id: currentUser.id,
            full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name,
            mobile_number: currentUser.user_metadata?.mobile_number || currentUser.user_metadata?.contact,
            avatar_url: currentUser.user_metadata?.avatar_url,
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
          avatar_url: profileData.avatar_url,
          role: profileData.role || currentUser.user_metadata?.role || 'user',
        };

      }
    } catch (err) {
      console.error("Profile sync/fetch error:", err);
    } finally {
      // CRITICAL: Only update user state if ID actually changed or this is the first load.
      // This prevents unnecessary re-renders that cascade to all dashboard components.
      const existingUser = userRef.current;
      if (!existingUser || existingUser.id !== currentUser.id || isInitial) {
        console.log('[Auth] User state updated in AuthContext:', currentUser.id);
        setUser(currentUser);
      } else {
        console.log('[Auth] User ID unchanged. Skipping state update to prevent UI flicker.');
      }
      profileFetchedRef.current = true;
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      if (error) {
        console.warn("Background session refresh error:", error.message);
        return; // Don't clear user on background error
      }
      if (currentUser) {
        await fetchProfile(currentUser);
      }
    } catch (err) {
      console.error("Refresh user error:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          if (session?.user) {
            await fetchProfile(session.user, true);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
        if (isMounted) setLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        console.log(`Auth Event: ${event}`);

        // TOKEN_REFRESHED fires when the tab becomes visible again.
        // The session is still valid — do NOT touch user state or trigger re-renders.
        if (event === 'TOKEN_REFRESHED') {
          console.log('[Auth] Token refreshed silently. UI state preserved to prevent loading hang.');
          return;
        }

        // INITIAL_SESSION is handled by initAuth above — skip to avoid double-fetch.
        if (event === 'INITIAL_SESSION') {
          console.log('[Auth] Initial session detected. UI already handled by initAuth.');
          return;
        }

        if (event === 'SIGNED_IN') {
          if (session?.user) {
            // Update last sign-in timestamp
            await supabase.from("profiles").update({ last_sign_in_at: new Date().toISOString() }).eq("id", session.user.id);
            if (isMounted) await fetchProfile(session.user, true);
          }
          return;
        }

        if (event === 'USER_UPDATED') {
          if (session?.user && isMounted) {
            await fetchProfile(session.user, true);
          }
          return;
        }

        if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUser(null);
            userRef.current = null;
            profileFetchedRef.current = false;
            setLoading(false);
          }
          return;
        }

        // For any other unknown events with no session, do nothing.
        // This prevents accidental user-clearing on edge-case events.
      }
    );

    initAuth();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []); // Run only once on mount

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>

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
