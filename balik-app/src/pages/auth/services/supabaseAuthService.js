import { supabase } from "../../../utils/supabaseClient";

export const signupWithEmail = async (email, password, fullName, contact) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          mobile_number: contact,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    // If session exists (email confirmation disabled), sync profile immediately
    if (data?.user && data?.session) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        mobile_number: contact,
        email: email,
        updated_at: new Date(),
      });
    }

    return {
      success: true,
      message: "Check your email for confirmation link",
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const loginWithPasswordSupabase = async (identifier, password) => {
  try {
    let email = identifier;

    // Check if identifier is a mobile number
    if (identifier.startsWith("09") || identifier.startsWith("+63")) {
      // Fetch the email associated with this mobile number from profiles
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("mobile_number", identifier)
        .single();

      if (profileError || !data?.email) {
        throw new Error("Mobile number not registered or no email associated.");
      }

      email = data.email;
    }

    // Login with the resolved email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const loginWithGoogleSupabase = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutSupabase = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    return null;
  }
};
