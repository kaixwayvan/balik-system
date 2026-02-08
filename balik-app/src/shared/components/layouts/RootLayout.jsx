import { Outlet } from "react-router-dom"
import Header from "../partials/Header"
import Footer from "../partials/Footer"

function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default RootLayout
