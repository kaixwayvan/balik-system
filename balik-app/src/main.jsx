import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"

import { PublicClientApplication } from "@azure/msal-browser"
import { MsalProvider } from "@azure/msal-react"

// MSAL CONFIG (frontend)
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || "00000000-0000-0000-0000-000000000000",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
}

// msal browser instance (frontend only)
let msalInstance = null

function getMsalInstance() {
  if (!msalInstance) {
    try {
      msalInstance = new PublicClientApplication(msalConfig)
    } catch (e) {
      console.warn("MSAL failed to initialize:", e)
      msalInstance = null
    }
  }
  return msalInstance
}

const instance = getMsalInstance()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {instance ? (
      <MsalProvider instance={instance}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MsalProvider>
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </StrictMode>
)