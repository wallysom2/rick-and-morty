import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Routes>
        <Route path="/" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-4xl font-bold text-green-400">Rick and Morty Catalog</h1></div>} />
        <Route path="/favorites" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-4xl font-bold text-yellow-400">Favorites</h1></div>} />
      </Routes>
    </div>
  )
}

export default App
