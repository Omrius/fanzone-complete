import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Home, Compass, Calendar, User, LayoutDashboard, LogOut, LogIn, Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/events', icon: Calendar, label: 'Evenements' },
    { to: '/explore', icon: Compass, label: 'Explorer' },
  ]

  if (isAuthenticated) {
    navLinks.push(
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/settings', icon: User, label: 'Profil' }
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-fanzone-dark/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-fanzone-accent" />
            <span className="text-xl font-bold gradient-text">FANZONE</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${location.pathname === link.to ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
                <link.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <img src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                    alt={user?.username} className="w-8 h-8 rounded-full bg-white/10" />
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
                <button onClick={signOut} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-red-400">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn-primary flex items-center gap-2 text-sm">
                <LogIn className="w-4 h-4" />Connexion
              </Link>
            )}
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/10">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-fanzone-dark border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${location.pathname === link.to ? 'bg-white/10 text-white' : 'text-gray-400'}`}>
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}