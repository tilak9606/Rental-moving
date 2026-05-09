import React, { useState, useEffect } from 'react'
import { propertyService } from '../services/propertyService.js'
import { useNavigate } from 'react-router-dom'
import { Heart, MapPin, Star, BedDouble, Bath, Trash2 } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const Shortlist = () => {
  const [shortlists, setShortlists] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchShortlist()
  }, [])

  const fetchShortlist = async () => {
    try {
      const { data } = await propertyService.getShortlist()
      setShortlists(data)
    } catch {
      toast.error('Failed to load shortlist')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (id) => {
    try {
      await propertyService.removeShortlist(id)
      toast.success('Removed from shortlist')
      fetchShortlist()
    } catch {
      toast.error('Failed to remove')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-container">
      <h1 className="section-title mb-8">My Shortlist</h1>

      {shortlists.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No saved properties</p>
          <p className="text-gray-400 text-sm mt-2">Click the heart icon on properties to save them</p>
        </div>
      ) : (
        <div className="property-grid">
          {shortlists.map((item) => (
            <div
              key={item._id}
              className="card-hover cursor-pointer group"
              onClick={() => navigate(`/property/${item.property?._id}`)}
            >
              <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                <img
                  src={item.property?.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600'}
                  alt={item.property?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemove(item._id); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.property?.title}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.property?.city}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-4 h-4" />
                    {item.property?.bedrooms} beds
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {item.property?.bathrooms || 1} bath
                  </span>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <span className="price-tag">${item.property?.rent}</span>
                  <span className="text-gray-500 text-sm"> /month</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Shortlist