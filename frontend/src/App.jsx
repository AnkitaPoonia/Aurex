import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Research from './pages/Research'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/research/:query" element={<Research />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
