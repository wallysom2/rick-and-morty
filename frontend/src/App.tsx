import { Routes, Route } from 'react-router-dom'
import { Header } from './components'
import { HomePage, FavoritesPage } from './pages'

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
