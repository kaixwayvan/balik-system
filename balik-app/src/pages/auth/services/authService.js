import axios from "axios"

export const loginWithGoogle = async (accessToken) => {
  return axios.post("http://localhost:5000/api/auth/google", {
    access_token: accessToken,
  })
}

export const loginWithPassword = async (credentials) => {
  return axios.post("http://localhost:5000/api/auth/login", credentials)
}