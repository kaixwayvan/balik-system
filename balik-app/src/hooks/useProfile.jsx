import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile(currentUser) {
      try {
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        let profileData = data;

        // Fallback sync logic
        if (profileError || !data) {
          console.log("[ProfileProvider] Profile missing or error, syncing from metadata...");
          const { data: syncedData, error: syncError } = await supabase
            .from("profiles")
            .upsert({
              id: currentUser.id,
              full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name,
              mobile_number: currentUser.user_metadata?.mobile_number || currentUser.user_metadata?.contact,
              avatar_url: currentUser.user_metadata?.avatar_url,
              email: currentUser.email,
              role: currentUser.user_metadata?.role || 'user',
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (!syncError) {
            profileData = syncedData;
          }
        }

        if (isMounted) {
          setProfile(profileData);
          setError(null);
        }
      } catch (err) {
        console.error("[ProfileProvider] Error fetching profile:", err.message);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("[ProfileProvider] getSession returned", session?.user?.id);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        console.log("[ProfileProvider] No session on mount");
        if (isMounted) setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        // Ignore noise events
        if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
          return;
        }

        if (session?.user) {
          if (event === 'SIGNED_IN') {
             await supabase.from("profiles").update({ last_sign_in_at: new Date().toISOString() }).eq("id", session.user.id);
             setLoading(true);
             fetchProfile(session.user);
          }
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, error, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
