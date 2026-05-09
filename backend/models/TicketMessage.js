import mongoose from 'mongoose';

const ticketMessageSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'SupportTicket', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  attachments: [{ type: String }],
  isInternal: { type: Boolean, default: false }
}, { timestamps: true });

const TicketMessage = mongoose.model('TicketMessage', ticketMessageSchema);
export default TicketMessage;