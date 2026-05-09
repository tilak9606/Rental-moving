import mongoose from 'mongoose';

const moveInChecklistSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visit: { type: mongoose.Schema.Types.ObjectId, ref: 'Visit', required: true },
  status: { type: String, enum: ['pending', 'documents_uploaded', 'agreement_signed', 'inventory_checked', 'move_in_complete'], default: 'pending' },
  documents: [{
    type: { type: String, enum: ['id_proof', 'address_proof', 'income_proof', 'employment_proof', 'other'] },
    url: { type: String },
    uploadedAt: { type: Date }
  }],
  agreementUrl: { type: String },
  agreementSignedAt: { type: Date },
  moveInDate: { type: Date },
  moveInNotes: { type: String },
  landlordApproval: { type: Boolean, default: false },
  landlordApprovalAt: { type: Date }
}, { timestamps: true });

const MoveInChecklist = mongoose.model('MoveInChecklist', moveInChecklistSchema);
export default MoveInChecklist;