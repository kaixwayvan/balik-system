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
        emailRedirectTo: `${import.meta.env.VITE_APP_URL || window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

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
    // Check if identifier is email or mobile
    let email = identifier;

    if (identifier.startsWith("09") || identifier.startsWith("+63")) {
      // If mobile, fetch user by phone from database first
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("mobile_number", identifier)
        .single();

      if (error || !data) {
        throw new Error("Mobile number not registered.");
      }

      // Since we don't have the email in the profiles table, we can't easily
      // convert mobile to email for Supabase Auth's signInWithPassword.
      // We will advise using email for now.
      throw new Error("Mobile login is currently being configured. Please use your PUP email to log in.");
    }

    // Login with email and password
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
        redirectTo: `${import.meta.env.VITE_APP_URL || window.location.origin}/dashboard`,
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
