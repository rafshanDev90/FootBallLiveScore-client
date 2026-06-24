import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="text-emerald-400 text-xl">⚽</span>
          World Cup 2026
        </Link>
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-emerald-400 transition-colors">Live</Link>
          <Link to="/matches" className="hover:text-emerald-400 transition-colors">Matches</Link>
          <Link to="/standings" className="hover:text-emerald-400 transition-colors">Standings</Link>
        </div>
      </div>
    </nav>
  )
}
