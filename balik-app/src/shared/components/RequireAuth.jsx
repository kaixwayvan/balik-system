import { Navigate } from "react-router-dom"
import { getCurrentUser } from "../../pages/auth/services/authService"

export default function RequireAuth({ children }) {
  const user = getCurrentUser()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}
