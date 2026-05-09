import api from './api.js'

export const propertyService = {
  getProperties: (filters = {}) => api.get('/properties', { params: filters }),
  getPropertyById: (id) => api.get(`/properties/${id}`),
  createProperty: (data) => api.post('/properties', data),
  updateProperty: (id, data) => api.put(`/properties/${id}`, data),
  deleteProperty: (id) => api.put(`/properties/${id}/delete`),
  getMyProperties: () => api.get('/properties/my-properties'),
  shortlistProperty: (propertyId) => api.post('/properties/shortlist', { propertyId }),
  getShortlist: () => api.get('/properties/shortlist'),
  removeShortlist: (id) => api.delete(`/properties/shortlist/${id}`),
  compareProperties: (ids) => api.post('/properties/compare', { ids }),
  uploadImages: (formData) => api.post('/properties/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}