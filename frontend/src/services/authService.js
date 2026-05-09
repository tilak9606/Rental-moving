import api from './api.js'

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  getToken: () => localStorage.getItem('token'),
  getUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user))
}