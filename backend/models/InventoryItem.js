import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  moveInChecklist: { type: mongoose.Schema.Types.ObjectId, ref: 'MoveInChecklist', required: true },
  itemName: { type: String, required: true },
  category: { type: String },
  condition: { type: String},
  preMoveInCondition: { type: String},
  postMoveInCondition: { type: String},
  preMoveInImages: [{ type: String }],
  postMoveInImages: [{ type: String }],
  notes: { type: String },
  tenantVerified: { type: Boolean, default: false },
  landlordVerified: { type: Boolean, default: false }
}, { timestamps: true });

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
export default InventoryItem;