import Visit from '../models/Visit.js';
import Property from '../models/Property.js';

export const requestVisit = async (req, res, next) => {
  try {
    const { propertyId, preferredDate, preferredTime } = req.body;
    const property = await Property.findById(propertyId);
    if (!property || property.status !== 'published') {
      return res.status(400).json({ message: 'Property not available for visits' });
    }
    const existingVisit = await Visit.findOne({
      property: propertyId,
      tenant: req.user._id,
      status: { $in: ['requested', 'scheduled'] }
    });
    if (existingVisit) return res.status(400).json({ message: 'Active visit request already exists' });
    const visit = await Visit.create({
      property: propertyId,
      tenant: req.user._id,
      preferredDate: new Date(preferredDate),
      preferredTime
    });
    res.status(201).json(visit);
  }   catch (error) {
    next(error); 
  }
};

export const getMyVisits = async (req, res, next) => {
  try {
    const visits = await Visit.find({ tenant: req.user._id })
      .populate('property', 'title address city rent images')
      .sort({ createdAt: -1 });
    res.json(visits);
  }   catch (error) {
    next(error); 
  }
};

export const getLandlordVisits = async (req, res, next) => {
  try {
    const properties = await Property.find({ landlord: req.user._id }).select('_id');
    const propertyIds = properties.map(p => p._id);
    const visits = await Visit.find({ property: { $in: propertyIds } })
      .populate('property', 'title address city rent')
      .populate('tenant', 'name phone email')
      .sort({ createdAt: -1 });
    res.json(visits);
  }   catch (error) {
    next(error); 
  }
};

export const scheduleVisit = async (req, res, next) => {
  try {
    const { visitId } = req.params;
    const { scheduledDateTime } = req.body;
    const visit = await Visit.findById(visitId).populate('property');
    if (!visit) return res.status(404).json({ message: 'Visit not found' });
    if (visit.property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (visit.status !== 'requested') return res.status(400).json({ message: 'Visit must be in requested status' });
    visit.status = 'scheduled';
    visit.scheduledDateTime = new Date(scheduledDateTime);
    await visit.save();
    res.json(visit);
  }   catch (error) {
    next(error); 
  }
};

export const markVisited = async (req, res, next) => {
  try {
    const { visitId } = req.params;
    const visit = await Visit.findById(visitId).populate('property');
    if (!visit) return res.status(404).json({ message: 'Visit not found' });
    if (visit.property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (visit.status !== 'scheduled') return res.status(400).json({ message: 'Visit must be scheduled first' });
    visit.status = 'visited';
    await visit.save();
    res.json(visit);
  }  catch (error) {
    next(error); 
  }
};

export const makeDecision = async (req, res, next) => {
  try {
    const { visitId } = req.params;
    const { approved, notes } = req.body;
    const visit = await Visit.findById(visitId).populate('property');
    if (!visit) return res.status(404).json({ message: 'Visit not found' });
    if (visit.property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (visit.status !== 'visited') return res.status(400).json({ message: 'Visit must be marked as visited first' });
    visit.status = approved ? 'approved' : 'rejected';
    visit.decision = { approved, notes, decidedAt: new Date() };
    await visit.save();
    res.json(visit);
  }   catch (error) {
    next(error); 
  }
};

export const cancelVisit = async (req, res, next) => {
  try {
    const { visitId } = req.params;
    const visit = await Visit.findById(visitId);
    if (!visit) return res.status(404).json({ message: 'Visit not found' });
    if (visit.tenant.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (!['requested', 'scheduled'].includes(visit.status)) {
      return res.status(400).json({ message: 'Cannot cancel this visit' });
    }
    visit.status = 'cancelled';
    await visit.save();
    res.json(visit);
  }   catch (error) {
    next(error); 
  }
};

export const addFeedback = async (req, res, next) => {
  try {
    const { visitId } = req.params;
    const { feedback } = req.body;
    const visit = await Visit.findById(visitId);
    if (!visit) return res.status(404).json({ message: 'Visit not found' });
    if (visit.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    visit.tenantFeedback = feedback;
    await visit.save();
    res.json(visit);
  }  catch (error) {
    next(error); 
  }
};