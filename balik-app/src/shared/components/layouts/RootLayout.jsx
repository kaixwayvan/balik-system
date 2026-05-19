import { Outlet } from "react-router-dom"
import { PageWrapper } from "../../../pages/transition/PageWrapper";
import Header from "../partials/Header"
import Footer from "../partials/Footer"

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex flex-col">
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout