import User from '../models/User.js';
import Property from '../models/Property.js';
import Visit from '../models/Visit.js';
import SupportTicket from '../models/SupportTicket.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const publishedProperties = await Property.countDocuments({ status: 'published' });
    const pendingProperties = await Property.countDocuments({ status: 'review' });
    const totalVisits = await Visit.countDocuments();
    const pendingVisits = await Visit.countDocuments({ status: 'requested' });
    const openTickets = await SupportTicket.countDocuments({ status: { $in: ['open', 'in_progress'] } });
    res.json({
      totalUsers,
      totalProperties,
      publishedProperties,
      pendingProperties,
      totalVisits,
      pendingVisits,
      openTickets
    });
  }  catch (error) {
    next(error); 
  }
};

export const getPendingProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ status: 'review' })
      .populate('landlord', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(properties);
  }  catch (error) {
    next(error); 
  }
};

export const reviewProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { action } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.status !== 'review') {
      return res.status(400).json({ message: 'Property not in review status' });
    }
    property.status = action === 'approve' ? 'published' : 'draft';
    await property.save();
    res.json(property);
  } catch (error) {
    next(error); 
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  }  catch (error) {
    next(error); 
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  }  catch (error) {
    next(error); 
  }
};