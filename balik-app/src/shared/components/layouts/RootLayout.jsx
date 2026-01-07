import Header from "../partials/Header"
import Footer from "../partials/Footer"

function RootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default RootLayout
