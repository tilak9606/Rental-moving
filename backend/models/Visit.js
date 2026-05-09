import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  preferredDate: { type: Date, required: true },
  preferredTime: { type: String, required: true },
  scheduledDateTime: { type: Date },
  
  status: { 
    type: String, 
    enum: ['requested', 'scheduled', 'visited', 'approved', 'rejected', 'cancelled'], 
    default: 'requested' 
  },
  
  decision: {
    approved: { type: Boolean },
    notes: { type: String },
    decidedAt: { type: Date }
  },
  
  tenantFeedback: { type: String },
  landlordNotes: { type: String },
  reminderSent: { type: Boolean, default: false }
}, { timestamps: true });

visitSchema.index({ property: 1, tenant: 1, status: 1 }, { 
  partialFilterExpression: { 
    status: { $in: ['requested', 'scheduled'] } 
  } 
});

const Visit = mongoose.model('Visit', visitSchema);
export default Visit;