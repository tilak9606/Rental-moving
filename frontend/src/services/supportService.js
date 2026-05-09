import api from './api.js'

export const supportService = {
  createTicket: (data) => api.post('/support', data),
  getMyTickets: () => api.get('/support/my-tickets'),
  getAllTickets: (filters = {}) => api.get('/support/all', { params: filters }),
  getTicketById: (id) => api.get(`/support/${id}`),
  addMessage: (ticketId, message) => api.post(`/support/${ticketId}/messages`, { message }),
  updateTicketStatus: (ticketId, status, assignedTo) => 
    api.put(`/support/${ticketId}/status`, { status, assignedTo })
}