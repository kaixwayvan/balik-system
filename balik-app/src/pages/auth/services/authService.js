import axios from "axios"

const API_BASE = "http://localhost/BALIK/balik-system/balik-app/backend"

export const loginWithGoogle = async (accessToken) => {
  return axios.post(`${API_BASE}/google.php`, {
    access_token: accessToken,
  })
}

export const loginWithPassword = async (credentials) => {
  // Call backend
  const res = await axios.post(`${API_BASE}/login.php`, credentials)
  // If backend returns a user, persist to localStorage for client-side auth
  if (res?.data?.success && res.data.user) {
    try {
      localStorage.setItem("balik_user", JSON.stringify(res.data.user))
    } catch (e) {
      // ignore localStorage errors
    }
  }
  return res
}

export const forgotPassword = async (payload) => {
  return axios.post(`${API_BASE}/forgot_password.php`, payload)
}

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("balik_user")
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export const logout = () => {
  try {
    localStorage.removeItem("balik_user")
  } catch (e) {}
}