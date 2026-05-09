import React, { useState, useEffect } from 'react'
import { visitService } from '../../services/visitService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Calendar, Clock, MapPin, Home, MessageSquare, X } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import toast from 'react-hot-toast'

const MyVisits = () => {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbackModal, setFeedbackModal] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')

  useEffect(() => {
    fetchVisits()
  }, [])

  const fetchVisits = async () => {
    try {
      const { data } = await visitService.getMyVisits()
      setVisits(data)
    } catch {
      toast.error('Failed to load visits')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (visitId) => {
    try {
      await visitService.cancelVisit(visitId)
      toast.success('Visit cancelled')
      fetchVisits()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel')
    }
  }

  const handleFeedback = async (visitId) => {
    try {
      await visitService.addFeedback(visitId, feedbackText)
      toast.success('Feedback submitted')
      setFeedbackModal(null)
      setFeedbackText('')
      fetchVisits()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-container">
      <h1 className="section-title mb-8">My Visits</h1>

      {visits.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No visits yet</p>
          <p className="text-gray-400 text-sm mt-2">Browse properties and request a visit</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {visits.map((visit) => (
            <div key={visit._id} className="card flex flex-col md:flex-row gap-6">
              {/* Property Image */}
              <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden">
                <img
                  src={visit.property?.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'}
                  alt={visit.property?.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{visit.property?.title}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {visit.property?.city}
                    </div>
                  </div>
                  <StatusBadge status={visit.status} />
                </div>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(visit.preferredDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {visit.preferredTime}
                  </div>
                  {visit.scheduledDateTime && (
                    <div className="flex items-center gap-1.5 text-rose-600">
                      <Calendar className="w-4 h-4" />
                      Scheduled: {new Date(visit.scheduledDateTime).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  {['requested', 'scheduled'].includes(visit.status) && (
                    <button
                      onClick={() => handleCancel(visit._id)}
                      className="btn-secondary text-sm"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                  {visit.status === 'visited' && !visit.tenantFeedback && (
                    <button
                      onClick={() => setFeedbackModal(visit._id)}
                      className="btn-primary text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Add Feedback
                    </button>
                  )}
                  {visit.status === 'approved' && (
                    <button
                      onClick={() => window.location.href = `/movein/initiate?visitId=${visit._id}`}
                      className="btn-primary text-sm"
                    >
                      <Home className="w-4 h-4" />
                      Start Move-in
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4">Add Feedback</h2>
            <textarea
              className="input-field h-32 resize-none"
              placeholder="Share your experience about the visit..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setFeedbackModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleFeedback(feedbackModal)} className="btn-primary flex-1">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyVisits