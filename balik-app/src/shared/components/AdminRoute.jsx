import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Check if they exist AND if their role is admin (case-insensitive)
  const role = user?.user_metadata?.role?.toLowerCase();
  
  if (!user || role !== 'admin') {
    console.log("Access denied: User is not an admin. Role:", role);
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
