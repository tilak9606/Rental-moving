import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  moveInChecklist: { type: mongoose.Schema.Types.ObjectId, ref: 'MoveInChecklist' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['maintenance', 'billing', 'neighbor_issue', 'amenity', 'move_in', 'other'], required: true },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date },
  resolutionNotes: { type: String }
}, { timestamps: true });

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
export default SupportTicket;