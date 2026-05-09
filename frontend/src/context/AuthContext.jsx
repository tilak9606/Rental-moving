import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService.js'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken()
      if (token) {
        try {
          const { data } = await authService.getMe()
          setUser(data)
          authService.setUser(data)
        } catch {
          authService.logout()
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (credentials) => {
    const { data } = await authService.login(credentials)
    localStorage.setItem('token', data.token)
    setUser(data)
    authService.setUser(data)
    toast.success('Welcome back!')
    return data
  }

  const register = async (userData) => {
    const { data } = await authService.register(userData)
    localStorage.setItem('token', data.token)
    setUser(data)
    authService.setUser(data)
    toast.success('Account created successfully!')
    return data
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    toast.success('Logged out successfully')
    window.location.href = '/'
  }

  const isAdmin = user?.role === 'admin'
  const isLandlord = user?.role === 'landlord'
  const isTenant = user?.role === 'tenant'

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin, isLandlord, isTenant }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}