import React from 'react'

const statusStyles = {
  requested: 'bg-amber-100 text-amber-700',
  scheduled: 'bg-blue-100 text-blue-700',
  visited: 'bg-purple-100 text-purple-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700',
  published: 'bg-emerald-100 text-emerald-700',
  review: 'bg-amber-100 text-amber-700',
  draft: 'bg-gray-100 text-gray-700',
  rented: 'bg-rose-100 text-rose-700',
  open: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-gray-100 text-gray-700',
  pending: 'bg-amber-100 text-amber-700',
  documents_uploaded: 'bg-blue-100 text-blue-700',
  agreement_signed: 'bg-purple-100 text-purple-700',
  inventory_checked: 'bg-sky-100 text-sky-700',
  move_in_complete: 'bg-emerald-100 text-emerald-700',
}

const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-700'
  return (
    <span className={`badge ${style} capitalize`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export default StatusBadge