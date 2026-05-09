import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  address: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, required: true },
  pincode: { type: String },
  
  rent: { type: Number, required: true },
  deposit: { type: Number, required: true },
  maintenance: { type: Number, default: 0 },
  
  propertyType: { 
    type: String, 
    enum: ['apartment', 'independent_house', 'pg', 'studio'], 
    required: true 
  },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  areaSqft: { type: Number },
  floor: { type: String },
  furnished: { 
    type: Boolean, 
    default: false
  },
  
  amenities: [{ type: String }],
  
  rules: {
    bachelorFriendly: { type: Boolean, default: false },
    petFriendly: { type: Boolean, default: false },
    nonVegAllowed: { type: Boolean, default: true },
    otherRules: { type: String }
  },
  
  availableFrom: { type: Date, required: true },
  status: { 
  type: String, 
  enum: ['draft', 'review', 'published', 'rented', 'inactive'], 
  default: 'published' 
},
  
  images: [{ type: String }],
  coverImage: { type: String },
  
  preferredVisitTimes: [{
    day: { type: String, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    startTime: { type: String },
    endTime: { type: String }
  }],
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);
export default Property;