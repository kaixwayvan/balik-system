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
        role: 'user',
        updated_at: new Date(),
      });
    }

    return {
      success: true,
      message: "Check your email for verification code",
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const verifyOtp = async (email, token) => {
  try {
    // 1. Verify the code
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    });

    if (error) throw error;

    if (!data?.user) throw new Error("Verification failed - No user returned");

    // 2. We don't wait for profile sync here because the trigger handles it.
    // We just return success and let the app move on.
    return {
      success: true,
      user: data.user,
      session: data.session
    };
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return {
      success: false,
      error: error.message || "Invalid or expired code. Please try again."
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

    // Update last active timestamp
    if (data?.user) {
      await supabase.from("profiles").update({ last_sign_in_at: new Date().toISOString() }).eq("id", data.user.id);
    }

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

export const updateUserProfile = async (userId, updates) => {
  try {
    console.log("Service: Starting profile update for", userId);
    
    // Temporarily skipping Auth Metadata update because it is hanging the client
    // const { data: authData, error: authError } = await supabase.auth.updateUser({
    //   data: {
    //     full_name: updates.full_name,
    //     mobile_number: updates.mobile_number,
    //     avatar_url: updates.avatar_url,
    //     gender: updates.gender,
    //   }
    // });
    // if (authError) throw authError;

    // console.log("Service: Auth metadata updated successfully");


    // 2. Update Profiles Table with a strict 5-second timeout
    console.log("Service: Attempting database sync...");
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database sync timeout")), 5000);
    });

    // Create the actual DB promise
    const dbPromise = supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: updates.full_name,
        mobile_number: updates.mobile_number,
        avatar_url: updates.avatar_url,
        gender: updates.gender,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    // Race them
    try {
      const { error: profileError } = await Promise.race([dbPromise, timeoutPromise]);
      if (profileError) {
        console.error("Profile table sync error:", profileError);
        return { success: true, partial: true, error: profileError.message };
      }
      console.log("Service: Database sync successful");
    } catch (dbErr) {
      console.error("Profile table sync failed/timed out:", dbErr);
      // Return partial success so the UI doesn't hang
      return { success: true, partial: true, error: "Database sync timed out, but account is updated." };
    }

    return { success: true, user: null };
  } catch (error) {
    console.error("Service: Unexpected error:", error);
    return { success: false, error: error.message };
  }
};


export const uploadAvatar = async (userId, file) => {
  try {
    if (!file) throw new Error("No file provided");

    const fileExt = file.name.split('.').pop();
    // Use timestamp for uniqueness and cache-busting
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error("Storage upload error details:", uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("uploadAvatar catch error:", error);
    return { success: false, error: error.message || "Failed to upload image" };
  }
};


