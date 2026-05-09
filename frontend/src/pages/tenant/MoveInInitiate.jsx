import React, { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { moveInService } from '../../services/moveInService.js'
import toast from 'react-hot-toast'

const MoveInInitiate = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const visitId = searchParams.get('visitId')
  const hasInitiated = useRef(false)  // ← guard ref

  useEffect(() => {
    // Prevent double execution
    if (hasInitiated.current) return
    hasInitiated.current = true

    const initiate = async () => {
      if (!visitId) {
        toast.error('No visit ID provided')
        navigate('/my-visits')
        return
      }
      try {
        await moveInService.initiateMoveIn(visitId)
        toast.success('Move-in initiated successfully!')
        navigate('/my-moveins')
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to initiate move-in')
        navigate('/my-visits')
      }
    }
    initiate()
  }, [visitId, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4" />
        <p className="text-gray-600">Initiating move-in...</p>
      </div>
    </div>
  )
}

export default MoveInInitiate