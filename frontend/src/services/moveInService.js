import api from './api.js'

export const moveInService = {
  initiateMoveIn: (visitId) => api.post('/movein/initiate', { visitId }),
  getMyMoveIns: () => api.get('/movein/my-moveins'),
  getLandlordMoveIns: () => api.get('/movein/landlord-moveins'),
  uploadDocument: (checklistId, formData) => 
    api.post(`/movein/${checklistId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  signAgreement: (checklistId) => api.put(`/movein/${checklistId}/sign-agreement`),
  addInventoryItem: (checklistId, data) => api.post(`/movein/${checklistId}/inventory`, data),
  getInventoryItems: (checklistId) => api.get(`/movein/${checklistId}/inventory`),
  verifyInventory: (itemId, role) => api.put(`/movein/inventory/${itemId}/verify`, { role }),
  landlordApproveInventory: (checklistId) => api.put(`/movein/${checklistId}/landlord-approve-inventory`),
  completeMoveIn: (checklistId) => api.put(`/movein/${checklistId}/complete`)
}