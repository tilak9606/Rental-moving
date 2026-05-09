import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { propertyService } from '../services/propertyService.js'
import { Search, MapPin, Star, Heart, BedDouble, Bath, Maximize } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const categories = [
  { id: 'all', label: 'All', icon: '🏠' },
  { id: 'apartment', label: 'Apartments', icon: '🏢' },
  { id: 'house', label: 'Houses', icon: '🏡' },
  { id: 'condo', label: 'Condos', icon: '🏘️' },
  { id: 'studio', label: 'Studios', icon: '🎨' },
  { id: 'villa', label: 'Villas', icon: '🏛️' },
]

const Home = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchFilters, setSearchFilters] = useState({
    city: '', minRent: '', maxRent: '', bedrooms: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProperties()
  }, [activeCategory])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const filters = { status: 'published', ...searchFilters }
      if (activeCategory !== 'all') filters.propertyType = activeCategory
      const { data } = await propertyService.getProperties(filters)
      setProperties(data)
    } catch {
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProperties()
  }

  const handleShortlist = async (e, propertyId) => {
    e.stopPropagation()
    try {
      await propertyService.shortlistProperty(propertyId)
      toast.success('Added to shortlist')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to shortlist')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-b from-rose-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find your perfect home
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover verified properties with virtual visits and seamless move-in
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-bar max-w-2xl mx-auto">
            <div className="flex-1 px-6 py-3">
              <label className="block text-xs font-bold text-gray-900">Location</label>
              <input
                type="text"
                placeholder="Where to?"
                className="w-full text-sm text-gray-600 outline-none bg-transparent"
                value={searchFilters.city}
                onChange={(e) => setSearchFilters({ ...searchFilters, city: e.target.value })}
              />
            </div>
            <div className="flex-1 px-6 py-3 hidden sm:block">
              <label className="block text-xs font-bold text-gray-900">Price Range</label>
              <input
                type="text"
                placeholder="Any price"
                className="w-full text-sm text-gray-600 outline-none bg-transparent"
                value={searchFilters.maxRent ? `$${searchFilters.maxRent}` : ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '')
                  setSearchFilters({ ...searchFilters, maxRent: val })
                }}
              />
            </div>
            <button
              type="submit"
              className="m-2 w-12 h-12 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </form>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-20 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`category-pill whitespace-nowrap ${activeCategory === cat.id ? 'active' : ''}`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="page-container">
        {loading ? (
          <LoadingSpinner />
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No properties found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="property-grid">
            {properties.map((property) => (
              <div
                key={property._id}
                className="card-hover cursor-pointer group"
                onClick={() => navigate(`/property/${property._id}`)}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                  <img
                    src={property.coverImage || property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => handleShortlist(e, property._id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart className="w-5 h-5 text-gray-700" />
                  </button>
                  {property.furnished && (
                    <span className="absolute top-3 left-3 badge-rose">Furnished</span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {property.city}
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
                      {property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.bathrooms || 1} bath
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      {property.area || '--'} sqft
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <span className="price-tag">${property.rent}</span>
                    <span className="text-gray-500 text-sm"> /month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home