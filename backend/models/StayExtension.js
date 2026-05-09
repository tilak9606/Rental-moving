import mongoose from 'mongoose';

const stayExtensionSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  moveInChecklist: { type: mongoose.Schema.Types.ObjectId, ref: 'MoveInChecklist', required: true },
  currentEndDate: { type: Date, required: true },
  requestedEndDate: { type: Date, required: true },
  reason: { type: String },
  status: { type: String, enum: ['requested', 'approved', 'rejected'], default: 'requested' },
  landlordNotes: { type: String },
  approvedAt: { type: Date },
  newRentAmount: { type: Number }
}, { timestamps: true });

const StayExtension = mongoose.model('StayExtension', stayExtensionSchema);
export default StayExtension;