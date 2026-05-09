import api from './api.js'

export const visitService = {
  requestVisit: (data) => api.post('/visits', data),
  getMyVisits: () => api.get('/visits/my-visits'),
  getLandlordVisits: () => api.get('/visits/landlord-visits'),
  scheduleVisit: (visitId, scheduledDateTime) => 
    api.put(`/visits/${visitId}/schedule`, { scheduledDateTime }),
  markVisited: (visitId) => api.put(`/visits/${visitId}/visited`),
  makeDecision: (visitId, approved, notes) => 
    api.put(`/visits/${visitId}/decision`, { approved, notes }),
  cancelVisit: (visitId) => api.put(`/visits/${visitId}/cancel`),
  addFeedback: (visitId, feedback) => api.put(`/visits/${visitId}/feedback`, { feedback })
}