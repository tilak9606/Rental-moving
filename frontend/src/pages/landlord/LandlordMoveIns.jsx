import React, { useState, useEffect } from 'react'
import { moveInService } from '../../services/moveInService.js'
import { Home, CheckCircle, Package, User, FileText, Check, X, Eye, Download } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import toast from 'react-hot-toast'

const LandlordMoveIns = () => {
  const [moveIns, setMoveIns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMoveIn, setSelectedMoveIn] = useState(null)
  const [inventory, setInventory] = useState([])

  useEffect(() => {
    fetchMoveIns()
  }, [])

  const fetchMoveIns = async () => {
    try {
      const { data } = await moveInService.getLandlordMoveIns()
      setMoveIns(data)
    } catch {
      toast.error('Failed to load move-ins')
    } finally {
      setLoading(false)
    }
  }

  const fetchInventory = async (checklistId) => {
    try {
      const { data } = await moveInService.getInventoryItems(checklistId)
      setInventory(data)
    } catch {
      setInventory([])
    }
  }

  const handleApproveInventory = async (checklistId) => {
    try {
      await moveInService.landlordApproveInventory(checklistId)
      toast.success('Inventory approved')
      fetchMoveIns()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve')
    }
  }

  const handleComplete = async (checklistId) => {
    try {
      await moveInService.completeMoveIn(checklistId)
      toast.success('Move-in completed')
      fetchMoveIns()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete')
    }
  }

  const openDetail = (moveIn) => {
    setSelectedMoveIn(moveIn)
    fetchInventory(moveIn._id)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-container">
      <h1 className="section-title mb-8">Tenant Move-ins</h1>

      {moveIns.length === 0 ? (
        <div className="text-center py-20">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No move-ins yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {moveIns.map((moveIn) => (
            <div key={moveIn._id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden">
                    <img
                      src={moveIn.property?.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200'}
                      alt={moveIn.property?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{moveIn.property?.title}</h3>
                    <p className="text-gray-500 text-sm">{moveIn.property?.city}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <User className="w-3.5 h-3.5" />
                      {moveIn.tenant?.name}
                    </div>
                  </div>
                </div>
                <StatusBadge status={moveIn.status} />
              </div>

              {/* Documents Section with Actions */}
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Documents ({moveIn.documents?.length || 0})
                  </h4>
                  <button 
                    onClick={() => openDetail(moveIn)}
                    className="text-rose-600 text-sm hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View All
                  </button>
                </div>

                {moveIn.documents?.length > 0 ? (
                  <div className="grid gap-2">
                    {moveIn.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-rose-500" />
                          <span className="text-sm capitalize">{doc.type}</span>
                          <span className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <a 
                            href={doc.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No documents uploaded yet</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                {moveIn.status === 'agreement_signed' && (
                  <button
                    onClick={() => handleApproveInventory(moveIn._id)}
                    className="btn-primary text-sm"
                  >
                    <Package className="w-4 h-4" />
                    Approve Inventory Check
                  </button>
                )}
                {moveIn.status === 'inventory_checked' && (
                  <button
                    onClick={() => handleComplete(moveIn._id)}
                    className="btn-primary text-sm bg-emerald-500 hover:bg-emerald-600"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete Move-in
                  </button>
                )}
                <button 
                  onClick={() => openDetail(moveIn)}
                  className="btn-secondary text-sm ml-auto"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedMoveIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Move-in Details</h2>
              <button onClick={() => setSelectedMoveIn(null)} className="btn-ghost">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Documents */}
              <div>
                <h3 className="font-semibold mb-2">Documents</h3>
                {selectedMoveIn.documents?.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                    <div>
                      <p className="text-sm font-medium capitalize">{doc.type}</p>
                      <p className="text-xs text-gray-500">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                    </div>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-rose-600 text-sm hover:underline">
                      View
                    </a>
                  </div>
                )) || <p className="text-gray-400 text-sm">No documents</p>}
              </div>

              {/* Inventory */}
              <div>
                <h3 className="font-semibold mb-2">Inventory ({inventory.length})</h3>
                {inventory.map((item) => (
                  <div key={item._id} className="p-3 bg-gray-50 rounded-lg mb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.itemName}</p>
                        <p className="text-xs text-gray-500">{item.category} · {item.condition}</p>
                      </div>
                      <div className="flex gap-2">
                        {item.tenantVerified && <span className="badge badge-green text-xs">Tenant</span>}
                        {item.landlordVerified ? (
                          <span className="badge badge-green text-xs">You ✓</span>
                        ) : (
                          <button 
                            onClick={() => handleVerify(item._id, 'landlord')}
                            className="text-xs text-rose-600 hover:underline"
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )) || <p className="text-gray-400 text-sm">No inventory items</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandlordMoveIns