import SupportTicket from '../models/SupportTicket.js';
import TicketMessage from '../models/TicketMessage.js';
import Property from '../models/Property.js';

export const createTicket = async (req, res, next) => {
  try {
    const { propertyId, moveInChecklistId, title, description, category, priority } = req.body;
    const ticket = await SupportTicket.create({
      tenant: req.user._id,
      property: propertyId,
      moveInChecklist: moveInChecklistId,
      title,
      description,
      category,
      priority: priority || 'medium'
    });
    await TicketMessage.create({
      ticket: ticket._id,
      sender: req.user._id,
      message: description
    });
    res.status(201).json(ticket);
  }  catch (error) {
    next(error); 
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ tenant: req.user._id })
      .populate('property', 'title address')
      .sort({ createdAt: -1 });
    res.json(tickets);
  }   catch (error) {
    next(error); 
  }
};

export const getAllTickets = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    const tickets = await SupportTicket.find(filter)
      .populate('tenant', 'name email phone')
      .populate('property', 'title address')
      .sort({ createdAt: -1 });
    res.json(tickets);
  }  catch (error) {
    next(error); 
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('tenant', 'name email phone')
      .populate('property', 'title address')
      .populate('assignedTo', 'name');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    const messages = await TicketMessage.find({ ticket: req.params.id })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });
    res.json({ ticket, messages });
  }  catch (error) {
    next(error); 
  }
};

export const addMessage = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.tenant.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const msg = await TicketMessage.create({
      ticket: ticketId,
      sender: req.user._id,
      message
    });
    if (ticket.status === 'closed') {
      ticket.status = 'open';
      await ticket.save();
    }
    res.status(201).json(msg);
  }  catch (error) {
    next(error); 
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { status, assignedTo } = req.body;
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    ticket.status = status || ticket.status;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (status === 'resolved') ticket.resolvedAt = new Date();
    await ticket.save();
    res.json(ticket);
  }  catch (error) {
    next(error); 
  }
};