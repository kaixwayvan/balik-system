import axios from "axios"

export const loginWithGoogle = async (accessToken) => {
  return axios.post("http://localhost/BALIK/balik-system/balik-app/backend/google.php", {
    access_token: accessToken,
  })
}

export const loginWithPassword = async (credentials) => {
  return axios.post("http://localhost/BALIK/balik-system/balik-app/backend/login.php", credentials)
}

export const forgotPassword = async (payload) => {
  return axios.post("http://localhost/BALIK/balik-system/balik-app/backend/forgot_password.php", payload)
}