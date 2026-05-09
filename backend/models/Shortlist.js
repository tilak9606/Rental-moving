import mongoose from 'mongoose';

const shortlistSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  notes: { type: String },
  comparisonPriority: { type: Number, default: 0 }
}, { timestamps: true });

shortlistSchema.index({ tenant: 1, property: 1 }, { unique: true });

const Shortlist = mongoose.model('Shortlist', shortlistSchema);
export default Shortlist;