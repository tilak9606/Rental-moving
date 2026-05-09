import React, { useState, useEffect } from 'react'
import { visitService } from '../../services/visitService.js'
import { Calendar, Clock, User, Phone, Mail, Check, X, MessageSquare } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import toast from 'react-hot-toast'

const LandlordVisits = () => {
  const [visits, setVisits] = useState([])
  const [loading, setLoading] = useState(true)
  const [scheduleModal, setScheduleModal] = useState(null)
  const [decisionModal, setDecisionModal] = useState(null)
  const [scheduleDate, setScheduleDate] = useState('')
  const [decisionNotes, setDecisionNotes] = useState('')

  useEffect(() => {
    fetchVisits()
  }, [])

  const fetchVisits = async () => {
    try {
      const { data } = await visitService.getLandlordVisits()
      setVisits(data)
    } catch {
      toast.error('Failed to load visits')
    } finally {
      setLoading(false)
    }
  }

  const handleSchedule = async (visitId) => {
    try {
      await visitService.scheduleVisit(visitId, scheduleDate)
      toast.success('Visit scheduled')
      setScheduleModal(null)
      setScheduleDate('')
      fetchVisits()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule')
    }
  }

  const handleMarkVisited = async (visitId) => {
    try {
      await visitService.markVisited(visitId)
      toast.success('Marked as visited')
      fetchVisits()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update')
    }
  }

  const handleDecision = async (visitId, approved) => {
    try {
      await visitService.makeDecision(visitId, approved, decisionNotes)
      toast.success(approved ? 'Visit approved' : 'Visit rejected')
      setDecisionModal(null)
      setDecisionNotes('')
      fetchVisits()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to make decision')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-container">
      <h1 className="section-title mb-8">Visit Requests</h1>

      {visits.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No visit requests yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {visits.map((visit) => (
            <div key={visit._id} className="card">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Property Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{visit.property?.title}</h3>
                    <StatusBadge status={visit.status} />
                  </div>
                  <p className="text-gray-500 text-sm">{visit.property?.city}</p>

                  {/* Tenant Info */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-sm mb-2">Tenant</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{visit.tenant?.name}</p>
                        <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{visit.tenant?.phone}</span>
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{visit.tenant?.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visit Details */}
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Preferred: {new Date(visit.preferredDate).toLocaleDateString()}
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

                  {/* Feedback */}
                  {visit.tenantFeedback && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 text-amber-700 text-sm font-medium mb-1">
                        <MessageSquare className="w-4 h-4" />
                        Tenant Feedback
                      </div>
                      <p className="text-sm text-gray-600">{visit.tenantFeedback}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 md:w-48">
                  {visit.status === 'requested' && (
                    <button
                      onClick={() => setScheduleModal(visit._id)}
                      className="btn-primary text-sm w-full"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule
                    </button>
                  )}
                  {visit.status === 'scheduled' && (
                    <button
                      onClick={() => handleMarkVisited(visit._id)}
                      className="btn-primary text-sm w-full"
                    >
                      <Check className="w-4 h-4" />
                      Mark Visited
                    </button>
                  )}
                  {visit.status === 'visited' && (
                    <>
                      <button
                        onClick={() => setDecisionModal({ id: visit._id, approved: true })}
                        className="btn-primary text-sm w-full bg-emerald-500 hover:bg-emerald-600"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => setDecisionModal({ id: visit._id, approved: false })}
                        className="btn-danger text-sm w-full"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4">Schedule Visit</h2>
            <input
              type="datetime-local"
              className="input-field"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              required
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setScheduleModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleSchedule(scheduleModal)} className="btn-primary flex-1">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {decisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4">
              {decisionModal.approved ? 'Approve Visit' : 'Reject Visit'}
            </h2>
            <textarea
              className="input-field h-24 resize-none"
              placeholder="Add notes (optional)..."
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setDecisionModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button
                onClick={() => handleDecision(decisionModal.id, decisionModal.approved)}
                className={decisionModal.approved ? 'btn-primary flex-1 bg-emerald-500 hover:bg-emerald-600' : 'btn-danger flex-1'}
              >
                {decisionModal.approved ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandlordVisits