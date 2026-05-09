import Property from '../models/Property.js';
import Shortlist from '../models/Shortlist.js';

export const createProperty = async (req, res, next) => {
  try {
    const propertyData = { ...req.body, landlord: req.user._id };
    if (req.files && req.files.length > 0) {
      propertyData.images = req.files.map(file => file.path);
      propertyData.coverImage = req.files[0].path;
    }
    const property = await Property.create(propertyData);
    res.status(201).json(property);
  }  catch (error) {
    next(error); 
  }
};

export const getProperties = async (req, res, next) => {
  try {
    const { city, area, minRent, maxRent, propertyType, bedrooms, furnished, status = 'published' } = req.query;
    const filter = { isActive: true };
    if (city) filter.city = new RegExp(city, 'i');
    if (area) filter.area = new RegExp(area, 'i');
    if (propertyType) filter.propertyType = propertyType;
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (furnished) filter.furnished = furnished;
    if (minRent || maxRent) {
      filter.rent = {};
      if (minRent) filter.rent.$gte = Number(minRent);
      if (maxRent) filter.rent.$lte = Number(maxRent);
    }
    const properties = await Property.find(filter).populate('landlord', 'name phone');
    res.json(properties);
  }  catch (error) {
    next(error); 
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate('landlord', 'name phone email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  }  catch (error) {
    next(error); 
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.landlord.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => file.path);
      req.body.coverImage = req.files[0].path;
    }
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  }  catch (error) {
    next(error); 
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.landlord.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    property.isActive = false;
    await property.save();
    res.json({ message: 'Property deleted' });
  }  catch (error) {
    next(error); 
  }
};

export const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ landlord: req.user._id }).sort({ createdAt: -1 });
    res.json(properties);
  }   catch (error) {
    next(error); 
  }
};

export const shortlistProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const exists = await Shortlist.findOne({ tenant: req.user._id, property: propertyId });
    if (exists) return res.status(400).json({ message: 'Already shortlisted' });
    const shortlist = await Shortlist.create({ tenant: req.user._id, property: propertyId });
    res.status(201).json(shortlist);
  }   catch (error) {
    next(error); 
  }
};

export const getShortlist = async (req, res, next) => {
  try {
    const shortlists = await Shortlist.find({ tenant: req.user._id }).populate('property');
    res.json(shortlists);
  }   catch (error) {
    next(error); 
  }
};

export const removeShortlist = async (req, res, next) => {
  try {
    await Shortlist.findOneAndDelete({ tenant: req.user._id, property: req.params.id });
    res.json({ message: 'Removed from shortlist' });
  }  catch (error) {
    next(error); 
  }
};

export const compareProperties = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length < 2 || ids.length > 3) {
      return res.status(400).json({ message: 'Select 2-3 properties to compare' });
    }
    const properties = await Property.find({ _id: { $in: ids }, status: 'published' });
    res.json(properties);
  }   catch (error) {
    next(error); 
  }
};