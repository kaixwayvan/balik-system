import RootLayout from './shared/components/layouts/RootLayout'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {

  return (
    <>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

      </ RootLayout>
    </>
  )
}

export default App
