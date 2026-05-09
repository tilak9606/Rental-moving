import React, { useState, useEffect } from 'react'
import { moveInService } from '../../services/moveInService.js'
import { Home, FileText, CheckCircle, Upload, PenTool, Package } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const MyMoveIns = () => {
    const navigate = useNavigate() 
  const [moveIns, setMoveIns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMoveIns()
  }, [])

  const fetchMoveIns = async () => {
    try {
      const { data } = await moveInService.getMyMoveIns()
      setMoveIns(data)
    } catch {
      toast.error('Failed to load move-ins')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-container">
      <h1 className="section-title mb-8">My Move-ins</h1>

      {moveIns.length === 0 ? (
        <div className="text-center py-20">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No move-ins yet</p>
          <p className="text-gray-400 text-sm mt-2">Complete a visit and get approved to start</p>
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
                  </div>
                </div>
                <StatusBadge status={moveIn.status} />
              </div>

              {/* Progress Steps */}
              <div className="flex items-center gap-2 mt-6 py-4 border-t border-gray-100">
                {[
                  { status: 'pending', label: 'Initiated', icon: Home },
                  { status: 'documents_uploaded', label: 'Documents', icon: Upload },
                  { status: 'agreement_signed', label: 'Signed', icon: PenTool },
                  { status: 'inventory_checked', label: 'Inventory', icon: Package },
                  { status: 'move_in_complete', label: 'Complete', icon: CheckCircle },
                ].map((step, idx) => {
                  const isActive = getStatusIndex(moveIn.status) >= idx
                  const isCurrent = getStatusIndex(moveIn.status) === idx
                  return (
                    <React.Fragment key={step.status}>
                      <div className={`flex flex-col items-center gap-1 ${isActive ? 'text-rose-600' : 'text-gray-300'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-rose-100' : 'bg-gray-100'} ${isCurrent ? 'ring-2 ring-rose-500' : ''}`}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium">{step.label}</span>
                      </div>
                      {idx < 4 && (
                        <div className={`flex-1 h-0.5 ${isActive ? 'bg-rose-500' : 'bg-gray-200'}`} />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>

              {/* Actions based on status */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                {moveIn.status === 'pending' && (
                  <button
                    onClick={() => navigate(`/movein/${moveIn._id}`)}
                    className="btn-primary text-sm"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Documents
                  </button>
                )}
                {moveIn.status === 'documents_uploaded' && (
                  <button
                    onClick={() => window.location.href = `/movein/${moveIn._id}/sign`}
                    className="btn-primary text-sm"
                  >
                    <PenTool className="w-4 h-4" />
                    Sign Agreement
                  </button>
                )}
                {moveIn.status === 'inventory_checked' && (
                  <div className="text-emerald-600 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Waiting for landlord to complete move-in
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const statusOrder = ['pending', 'documents_uploaded', 'agreement_signed', 'inventory_checked', 'move_in_complete']
const getStatusIndex = (status) => statusOrder.indexOf(status)

export default MyMoveIns