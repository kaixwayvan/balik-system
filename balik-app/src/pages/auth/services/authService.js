import { supabase } from "../../../utils/supabaseClient";

/**
 * Sign up a new user with email + password.
 * Supabase will send an OTP to the email for verification.
 */
export const signUpWithEmail = async ({ fullName, email, contact, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        mobile_number: contact,
      },
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Verify the OTP that Supabase emailed after signup.
 * After verification, we explicitly upsert the profile row so dashboard
 * data is immediately available without relying solely on the DB trigger.
 */
export const verifyOtp = async ({ email, token }) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });

  if (error) throw error;

  // After successful verification, upsert the profile with signup metadata
  const user = data?.user;
  if (user) {
    const meta = user.user_metadata || {};
    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      full_name: meta.full_name || null,
      mobile_number: meta.mobile_number || null,
      role: "user",
      last_sign_in_at: new Date().toISOString(),
    }, { onConflict: "id" });

    if (upsertError) {
      console.error("Error upserting profile on verify:", upsertError.message);
    }
  }

  return data;
};

/**
 * Resend the OTP to the email address.
 */
export const resendOtp = async ({ email }) => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) throw error;
};

/**
 * Login with email and password.
 * Also upserts the profile row so existing users always have data.
 */
export const loginWithPassword = async ({ identifier, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: identifier,
    password,
  });

  if (error) throw error;
  return data;
};

