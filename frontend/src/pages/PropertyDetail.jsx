import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { propertyService } from '../services/propertyService.js'
import { visitService } from '../services/visitService.js'
import { useAuth } from '../context/AuthContext.jsx'
import {
  MapPin, BedDouble, Bath, Maximize, Heart, Share2, Star,
  Calendar, User, Phone, Mail, ArrowLeft, Check, Home
} from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isTenant } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showVisitModal, setShowVisitModal] = useState(false)
  const [visitForm, setVisitForm] = useState({ preferredDate: '', preferredTime: '' })
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    try {
      const { data } = await propertyService.getPropertyById(id)
      setProperty(data)
    } catch {
      toast.error('Failed to load property')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestVisit = async (e) => {
    e.preventDefault()
    try {
      await visitService.requestVisit({
        propertyId: id,
        ...visitForm
      })
      toast.success('Visit requested successfully!')
      setShowVisitModal(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request visit')
    }
  }

  const handleShortlist = async () => {
    try {
      await propertyService.shortlistProperty(id)
      toast.success('Added to shortlist')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to shortlist')
    }
  }

  if (loading) return <LoadingSpinner />
  if (!property) return null

  const images = property.images?.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600',
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600',
    'https://images.unsplash.com/photo-1556912173-3db996ea0622?w=600',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600'
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to listings
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center gap-2 text-gray-600 mt-2">
              <MapPin className="w-4 h-4" />
              {property.address}, {property.city}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShortlist}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden h-[400px]">
          <div className="relative h-full">
            <img
              src={images[activeImage]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:grid grid-cols-2 gap-2 h-full">
            {images.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative h-full">
                <img
                  src={img}
                  alt={`${property.title} ${idx + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold">
                  {property.propertyType?.charAt(0).toUpperCase() + property.propertyType?.slice(1)} hosted by {property.landlord?.name}
                </h2>
                <p className="text-gray-500 mt-1">
                  {property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'} · 
                  {property.bathrooms || 1} {property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}
                </p>
              </div>
              <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-gray-600" />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <Home className="w-8 h-8 text-gray-700" />
                <div>
                  <h3 className="font-semibold">Entire home</h3>
                  <p className="text-gray-500 text-sm">You'll have the property to yourself</p>
                </div>
              </div>
              {property.furnished && (
                <div className="flex items-center gap-4">
                  <Check className="w-8 h-8 text-gray-700" />
                  <div>
                    <h3 className="font-semibold">Fully furnished</h3>
                    <p className="text-gray-500 text-sm">Move in ready with all essentials</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="pb-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold mb-4">About this place</h3>
              <p className="text-gray-600 leading-relaxed">{property.description || 'No description available.'}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities?.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-gray-700" />
                    <span className="text-gray-600">{amenity}</span>
                  </div>
                )) || (
                  <p className="text-gray-500 col-span-2">No amenities listed</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 card border border-gray-200 shadow-airbnb">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-bold">${property.rent}</span>
                <span className="text-gray-500">/month</span>
              </div>

              {isTenant ? (
                <button
                  onClick={() => setShowVisitModal(true)}
                  className="btn-primary w-full py-4 text-base"
                >
                  Request a Visit
                </button>
              ) : !user ? (
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary w-full py-4 text-base"
                >
                  Log in to Request Visit
                </button>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm">Only tenants can request visits</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{property.landlord?.name}</p>
                    <p className="text-gray-500 text-xs">Property Owner</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  {property.landlord?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {property.landlord.phone}
                    </div>
                  )}
                  {property.landlord?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {property.landlord.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visit Modal */}
      {showVisitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4">Request a Visit</h2>
            <form onSubmit={handleRequestVisit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={visitForm.preferredDate}
                  onChange={(e) => setVisitForm({ ...visitForm, preferredDate: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Time</label>
                <input
                  type="time"
                  className="input-field"
                  value={visitForm.preferredTime}
                  onChange={(e) => setVisitForm({ ...visitForm, preferredTime: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowVisitModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyDetail