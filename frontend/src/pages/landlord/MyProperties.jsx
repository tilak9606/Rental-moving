import React, { useState, useEffect } from 'react'
import { propertyService } from '../../services/propertyService.js'
import { Plus, Edit2, Trash2, MapPin, BedDouble, DollarSign, Bath, Maximize, Building, Calendar, Home } from 'lucide-react'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import toast from 'react-hot-toast'

const MyProperties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)

  // Form state matching the Property schema exactly
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    area: '',
    pincode: '',
    rent: '',
    deposit: '',
    maintenance: '',
    propertyType: 'apartment',
    bedrooms: '',
    bathrooms: '',
    areaSqft: '',
    floor: '',
    furnished: false,
    amenities: [],
    bachelorFriendly: false,
    petFriendly: false,
    nonVegAllowed: true,
    otherRules: '',
    availableFrom: '',
    preferredVisitTimes: []
  })

  const [newAmenity, setNewAmenity] = useState('')
  const [visitTime, setVisitTime] = useState({ day: 'monday', startTime: '09:00', endTime: '18:00' })

  const amenityOptions = [
    'WiFi', 'Parking', 'Gym', 'Swimming Pool', 'Lift', 'Power Backup',
    'Security', 'Garden', 'Club House', 'CCTV', 'Water Purifier', 'Modular Kitchen'
  ]

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  useEffect(() => { fetchProperties() }, [])

  const fetchProperties = async () => {
    try {
      const { data } = await propertyService.getMyProperties()
      setProperties(data)
    } catch {
      toast.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '', description: '', address: '', city: '', area: '', pincode: '',
      rent: '', deposit: '', maintenance: '', propertyType: 'apartment',
      bedrooms: '', bathrooms: '', areaSqft: '', floor: '', furnished: false,
      amenities: [], bachelorFriendly: false, petFriendly: false,
      nonVegAllowed: true, otherRules: '', availableFrom: '',
      preferredVisitTimes: []
    })
    setNewAmenity('')
    setVisitTime({ day: 'monday', startTime: '09:00', endTime: '18:00' })
  }

  const openEdit = (property) => {
    setEditingProperty(property)
    setFormData({
      title: property.title || '',
      description: property.description || '',
      address: property.address || '',
      city: property.city || '',
      area: property.area || '',
      pincode: property.pincode || '',
      rent: property.rent || '',
      deposit: property.deposit || '',
      maintenance: property.maintenance || '',
      propertyType: property.propertyType || 'apartment',
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      areaSqft: property.areaSqft || '',
      floor: property.floor || '',
      furnished: property.furnished || false,
      amenities: property.amenities || [],
      bachelorFriendly: property.rules?.bachelorFriendly || false,
      petFriendly: property.rules?.petFriendly || false,
      nonVegAllowed: property.rules?.nonVegAllowed !== false,
      otherRules: property.rules?.otherRules || '',
      availableFrom: property.availableFrom ? property.availableFrom.split('T')[0] : '',
      preferredVisitTimes: property.preferredVisitTimes || []
    })
    setShowCreate(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Build payload matching schema exactly
    const payload = {
      ...formData,
      rent: Number(formData.rent),
      deposit: Number(formData.deposit),
      maintenance: Number(formData.maintenance) || 0,
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      areaSqft: Number(formData.areaSqft) || undefined,
      rules: {
        bachelorFriendly: formData.bachelorFriendly,
        petFriendly: formData.petFriendly,
        nonVegAllowed: formData.nonVegAllowed,
        otherRules: formData.otherRules
      },
      availableFrom: new Date(formData.availableFrom),
      preferredVisitTimes: formData.preferredVisitTimes
    }

    // Remove flat fields that belong in nested objects
    delete payload.bachelorFriendly
    delete payload.petFriendly
    delete payload.nonVegAllowed
    delete payload.otherRules

    try {
      if (editingProperty) {
        await propertyService.updateProperty(editingProperty._id, payload)
        toast.success('Property updated')
      } else {
        await propertyService.createProperty(payload)
        toast.success('Property created')
      }
      setShowCreate(false)
      setEditingProperty(null)
      resetForm()
      fetchProperties()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return
    try {
      await propertyService.deleteProperty(id)
      toast.success('Property deleted')
      fetchProperties()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete')
    }
  }

  const addAmenity = (amenity) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] })
    }
    setNewAmenity('')
  }

  const removeAmenity = (amenity) => {
    setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) })
  }

  const addVisitTime = () => {
    setFormData({
      ...formData,
      preferredVisitTimes: [...formData.preferredVisitTimes, { ...visitTime }]
    })
  }

  const removeVisitTime = (index) => {
    setFormData({
      ...formData,
      preferredVisitTimes: formData.preferredVisitTimes.filter((_, i) => i !== index)
    })
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">My Properties</h1>
        <button onClick={() => { setEditingProperty(null); resetForm(); setShowCreate(true); }} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No properties yet</p>
          <p className="text-gray-400 text-sm mt-2">Add your first property listing</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {properties.map((property) => (
            <div key={property._id} className="card flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden">
                <img
                  src={property.coverImage || property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {property.address}, {property.city}
                    </div>
                  </div>
                  <StatusBadge status={property.status} />
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />${property.rent}/mo</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />Deposit: ${property.deposit}</span>
                  <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" />{property.bedrooms}BHK</span>
                  <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.bathrooms} Bath</span>
                  <span className="flex items-center gap-1"><Maximize className="w-4 h-4" />{property.areaSqft} sqft</span>
                  <span className="capitalize">{property.propertyType?.replace('_', ' ')}</span>
                  {property.furnished && <span className="badge-rose">Furnished</span>}
                </div>

                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(property)} className="btn-secondary text-sm"><Edit2 className="w-4 h-4" />Edit</button>
                  <button onClick={() => handleDelete(property._id)} className="btn-danger text-sm"><Trash2 className="w-4 h-4" />Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 animate-fade-in-up my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">{editingProperty ? 'Edit Property' : 'Add New Property'}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Property Title *" className="input-field" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} required />
                  <select className="input-field" value={formData.propertyType} onChange={(e) => handleChange('propertyType', e.target.value)}>
                    <option value="apartment">Apartment</option>
                    <option value="independent_house">Independent House</option>
                    <option value="pg">PG</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>
                <textarea placeholder="Description *" className="input-field h-24 resize-none mt-4" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} required />
              </div>

              {/* Location */}
              <div>
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Address *" className="input-field" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} required />
                  <input type="text" placeholder="City *" className="input-field" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} required />
                  <input type="text" placeholder="Area/Locality *" className="input-field" value={formData.area} onChange={(e) => handleChange('area', e.target.value)} required />
                  <input type="text" placeholder="Pincode" className="input-field" value={formData.pincode} onChange={(e) => handleChange('pincode', e.target.value)} />
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="number" placeholder="Monthly Rent *" className="input-field" value={formData.rent} onChange={(e) => handleChange('rent', e.target.value)} required />
                  <input type="number" placeholder="Security Deposit *" className="input-field" value={formData.deposit} onChange={(e) => handleChange('deposit', e.target.value)} required />
                  <input type="number" placeholder="Maintenance" className="input-field" value={formData.maintenance} onChange={(e) => handleChange('maintenance', e.target.value)} />
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Property Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <input type="number" placeholder="Bedrooms *" className="input-field" value={formData.bedrooms} onChange={(e) => handleChange('bedrooms', e.target.value)} required />
                  <input type="number" placeholder="Bathrooms *" className="input-field" value={formData.bathrooms} onChange={(e) => handleChange('bathrooms', e.target.value)} required />
                  <input type="number" placeholder="Area (sqft)" className="input-field" value={formData.areaSqft} onChange={(e) => handleChange('areaSqft', e.target.value)} />
                  <input type="text" placeholder="Floor" className="input-field" value={formData.floor} onChange={(e) => handleChange('floor', e.target.value)} />
                </div>
                <div className="mt-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.furnished} onChange={(e) => handleChange('furnished', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-rose-600" />
                    <span className="text-sm">Fully Furnished</span>
                  </label>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {amenityOptions.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => addAmenity(amenity)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        formData.amenities.includes(amenity)
                          ? 'bg-rose-500 text-white border-rose-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
                {formData.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map(amenity => (
                      <span key={amenity} className="badge badge-rose flex items-center gap-1">
                        {amenity}
                        <button type="button" onClick={() => removeAmenity(amenity)} className="ml-1">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Rules */}
              <div>
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">House Rules</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.bachelorFriendly} onChange={(e) => handleChange('bachelorFriendly', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-rose-600" />
                    <span className="text-sm">Bachelor Friendly</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.petFriendly} onChange={(e) => handleChange('petFriendly', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-rose-600" />
                    <span className="text-sm">Pet Friendly</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.nonVegAllowed} onChange={(e) => handleChange('nonVegAllowed', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-rose-600" />
                    <span className="text-sm">Non-Veg Allowed</span>
                  </label>
                  <input type="text" placeholder="Other rules (optional)" className="input-field" value={formData.otherRules} onChange={(e) => handleChange('otherRules', e.target.value)} />
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Availability</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Available From *</label>
                    <input type="date" className="input-field" value={formData.availableFrom} onChange={(e) => handleChange('availableFrom', e.target.value)} required />
                  </div>
                </div>
              </div>

              {/* Preferred Visit Times */}
              <div>
                <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Preferred Visit Times</h3>
                <div className="flex gap-2 mb-3">
                  <select className="input-field" value={visitTime.day} onChange={(e) => setVisitTime({...visitTime, day: e.target.value})}>
                    {days.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </select>
                  <input type="time" className="input-field" value={visitTime.startTime} onChange={(e) => setVisitTime({...visitTime, startTime: e.target.value})} />
                  <input type="time" className="input-field" value={visitTime.endTime} onChange={(e) => setVisitTime({...visitTime, endTime: e.target.value})} />
                  <button type="button" onClick={addVisitTime} className="btn-secondary whitespace-nowrap">Add Time</button>
                </div>
                {formData.preferredVisitTimes.length > 0 && (
                  <div className="space-y-2">
                    {formData.preferredVisitTimes.map((vt, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="text-sm capitalize">{vt.day}: {vt.startTime} - {vt.endTime}</span>
                        <button type="button" onClick={() => removeVisitTime(i)} className="text-red-500 text-sm">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">
                  {editingProperty ? 'Update Property' : 'Create Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyProperties