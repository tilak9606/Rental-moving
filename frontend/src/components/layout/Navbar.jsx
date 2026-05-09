import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { 
  Search, Menu, User, Heart, LogOut, Home, Shield, Building2, 
  Calendar, Key, MessageSquare 
} from 'lucide-react'

const Navbar = () => {
  const { user, logout, isAdmin, isLandlord, isTenant } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const navLinks = [
    ...(isTenant ? [{ to: '/my-visits', icon: Calendar, label: 'My Visits' }] : []),
    ...(isTenant ? [{ to: '/my-moveins', icon: Key, label: 'Move-ins' }] : []),
    ...(isTenant ? [{ to: '/my-tickets', icon: MessageSquare, label: 'Support' }] : []),
    ...(isLandlord ? [{ to: '/landlord-visits', icon: Calendar, label: 'Visits' }] : []),
    ...(isLandlord ? [{ to: '/landlord-moveins', icon: Key, label: 'Move-ins' }] : []),
    ...(isLandlord ? [{ to: '/my-properties', icon: Building2, label: 'My Properties' }] : []),
    ...(isAdmin ? [{ to: '/admin', icon: Shield, label: 'Admin Dashboard' }] : []),
  ]

  return (
    <nav className="airbnb-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-rose-600 font-bold text-xl tracking-tight hidden sm:block">Rental</span>
          </Link>

          {/* Search Bar - Airbnb Style */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <button 
              onClick={() => navigate('/search')}
              className="search-bar w-full py-2.5 px-4 text-sm font-medium text-gray-900"
            >
              <span className="flex-1 px-4 text-left">Anywhere</span>
              <span className="flex-1 px-4 text-left hidden lg:block">Any week</span>
              <span className="flex-1 px-4 text-left text-gray-500 hidden lg:block">Add guests</span>
              <div className="ml-2 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {user && (
              <Link to="/shortlist" className="btn-ghost hidden sm:flex">
                <Heart className="w-5 h-5" />
              </Link>
            )}

            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 border border-gray-200 rounded-full p-1.5 pl-4 hover:shadow-airbnb transition-shadow duration-300"
              >
                <Menu className="w-4 h-4 text-gray-600" />
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-airbnb border border-gray-200 py-2 z-50 animate-fade-in-up">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        {navLinks.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                            onClick={() => setMenuOpen(false)}
                          >
                            <link.icon className="w-4 h-4" />
                            {link.label}
                          </Link>
                        ))}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={() => { logout(); setMenuOpen(false) }}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Log out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block px-4 py-3 text-sm font-semibold hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                          Log in
                        </Link>
                        <Link to="/register" className="block px-4 py-3 text-sm hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                          Sign up
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar