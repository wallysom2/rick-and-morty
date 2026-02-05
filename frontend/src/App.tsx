import { Routes, Route } from 'react-router-dom'
import { Header, Footer, ChatWidget } from './components'
import {
  HomePage,
  FavoritesPage,
  CharacterPage,
  EpisodesPage,
  EpisodePage,
  LocationsPage,
  LocationPage
} from './pages'

function App() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/character/:id" element={<CharacterPage />} />
          <Route path="/episodes" element={<EpisodesPage />} />
          <Route path="/episodes/:id" element={<EpisodePage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/locations/:id" element={<LocationPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default App

