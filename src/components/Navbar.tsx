import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: 'Live' },
    { to: '/matches', label: 'Matches' },
    { to: '/standings', label: 'Standings' },
  ]

  return (
    <nav className="bg-bg-card border-b border-border-dark">
      <div className="flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-white">
          <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          World Cup 2026
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-text-secondary hover:text-white transition-colors"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <div className="hidden md:flex gap-6 text-sm font-medium">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-text-secondary hover:text-accent transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border-dark bg-bg-card">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-text-secondary hover:text-accent hover:bg-bg-card-hover transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
