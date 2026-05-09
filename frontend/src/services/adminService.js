import api from './api.js'

export const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getPendingProperties: () => api.get('/admin/pending-properties'),
  reviewProperty: (propertyId, action) => api.put(`/admin/properties/${propertyId}/review`, { action }),
  getAllUsers: (role) => api.get('/admin/users', { params: { role } }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle`)
}