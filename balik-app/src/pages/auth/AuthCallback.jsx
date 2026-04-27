import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setError("Failed to confirm email. Please try again.");
          console.error(error);
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        if (data?.session) {
          const user = data.session.user;
          console.log("✅ Email confirmed! Session created.");

          // Sync profile to ensure mobile login and display data are available
          await supabase.from("profiles").upsert({
            id: user.id,
            full_name: user.user_metadata?.full_name,
            mobile_number: user.user_metadata?.mobile_number,
            email: user.email,
            updated_at: new Date(),
          });

          // Fetch role from profiles table for immediate redirection
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          const role = profile?.role || user.user_metadata?.role || 'user';
          
          // Redirect to appropriate dashboard based on role
          setTimeout(() => {
            if (role.toLowerCase() === 'admin') {
              navigate("/admin", { replace: true });
            } else {
              navigate("/dashboard", { replace: true });
            }
          }, 2000);
        } else {
          setError("Session not found. Please log in.");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
        console.error(err);
        setTimeout(() => navigate("/login"), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Confirming your email...</p>
          </>
        ) : error ? (
          <>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-500">Redirecting to login...</p>
          </>
        ) : (
          <>
            <p className="text-green-600 mb-4">✅ Email confirmed successfully!</p>
            <p className="text-gray-500">Redirecting to dashboard...</p>
          </>
        )}
      </div>
    </div>
  );
}
