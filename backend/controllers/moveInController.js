import MoveInChecklist from '../models/MoveInChecklist.js';
import InventoryItem from '../models/InventoryItem.js';
import Visit from '../models/Visit.js';
import Property from '../models/Property.js';

export const initiateMoveIn = async (req, res, next) => {
  try {
    const { visitId } = req.body;
    const visit = await Visit.findById(visitId).populate('property');
    if (!visit || visit.status !== 'approved') {
      return res.status(400).json({ message: 'Visit must be approved to initiate move-in' });
    }
    if (visit.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const existing = await MoveInChecklist.findOne({ visit: visitId });
    if (existing) return res.status(400).json({ message: 'Move-in already initiated' });
    const checklist = await MoveInChecklist.create({
      property: visit.property._id,
      tenant: req.user._id,
      visit: visitId
    });
    res.status(201).json(checklist);
  } catch (error) {
    next(error); 
  }
};

export const getMyMoveIns = async (req, res, next) => {
  try {
    const checklists = await MoveInChecklist.find({ tenant: req.user._id })
      .populate('property', 'title address city rent images')
      .populate('visit', 'status decision')
      .sort({ createdAt: -1 });
    res.json(checklists);
  }  catch (error) {
    next(error); 
  }
};

export const getLandlordMoveIns = async (req, res, next) => {
  try {
    const properties = await Property.find({ landlord: req.user._id }).select('_id');
    const propertyIds = properties.map(p => p._id);
    const checklists = await MoveInChecklist.find({ property: { $in: propertyIds } })
      .populate('property', 'title address city rent')
      .populate('tenant', 'name phone email')
      .sort({ createdAt: -1 });
    res.json(checklists);
  }  catch (error) {
    next(error); 
  }
};

export const uploadDocument = async (req, res, next) => {
  try {
    const { checklistId } = req.params;
    const { docType } = req.body;
    const checklist = await MoveInChecklist.findById(checklistId);
    if (!checklist) return res.status(404).json({ message: 'Checklist not found' });
    if (checklist.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    checklist.documents.push({
      type: docType || 'other',
      url: req.file.path,
      uploadedAt: new Date()
    });
    if (checklist.documents.length >= 3 && checklist.status === 'pending') {
      checklist.status = 'documents_uploaded';
    }
    await checklist.save();
    res.json(checklist);
  }  catch (error) {
    next(error); 
  }
};

export const signAgreement = async (req, res, next) => {
  try {
    const { checklistId } = req.params;
    const checklist = await MoveInChecklist.findById(checklistId);
    if (!checklist) return res.status(404).json({ message: 'Checklist not found' });
    if (checklist.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (checklist.status !== 'documents_uploaded') {
      return res.status(400).json({ message: 'Documents must be uploaded first' });
    }
    checklist.agreementSignedAt = new Date();
    checklist.status = 'agreement_signed';
    await checklist.save();
    res.json(checklist);
  } catch (error) {
    next(error); 
  }
};

export const addInventoryItem = async (req, res, next) => {
  try {
    const { checklistId } = req.params;
    const { itemName, category, preMoveInCondition, notes } = req.body;
    const checklist = await MoveInChecklist.findById(checklistId);
    if (!checklist) return res.status(404).json({ message: 'Checklist not found' });
    if (checklist.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const item = await InventoryItem.create({
      moveInChecklist: checklistId,
      itemName,
      category,
      condition: preMoveInCondition,
      preMoveInCondition,
      notes
    });
    res.status(201).json(item);
  }  catch (error) {
    next(error); 
  }
};

export const getInventoryItems = async (req, res, next) => {
  try {
    const { checklistId } = req.params;
    const items = await InventoryItem.find({ moveInChecklist: checklistId });
    res.json(items);
  }  catch (error) {
    next(error); 
  }
};

export const verifyInventory = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { role } = req.body;
    const item = await InventoryItem.findById(itemId).populate('moveInChecklist');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    const checklist = item.moveInChecklist;
    if (role === 'tenant' && checklist.tenant.toString() === req.user._id.toString()) {
      item.tenantVerified = true;
    } else if (role === 'landlord') {
      const property = await Property.findById(checklist.property);
      if (property.landlord.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      item.landlordVerified = true;
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await item.save();
    res.json(item);
  }  catch (error) {
    next(error); 
  }
};

export const completeMoveIn = async (req, res, next) => {
  try {
    const { checklistId } = req.params;
    const checklist = await MoveInChecklist.findById(checklistId).populate('property');
    if (!checklist) return res.status(404).json({ message: 'Checklist not found' });
    const property = checklist.property;
    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (checklist.status !== 'inventory_checked') {
      return res.status(400).json({ message: 'Inventory must be checked first' });
    }
    checklist.landlordApproval = true;
    checklist.landlordApprovalAt = new Date();
    checklist.status = 'move_in_complete';
    checklist.moveInDate = new Date();
    await checklist.save();
    await Property.findByIdAndUpdate(property._id, { status: 'rented' });
    res.json(checklist);
  } catch (error) {
    next(error); 
  }
};

export const landlordApproveInventory = async (req, res, next) => {
  try {
    const { checklistId } = req.params;
  const checklist = await MoveInChecklist.findById(checklistId).populate('property');
  
  if (checklist.status !== 'agreement_signed') {
    return res.status(400).json({ message: 'Agreement must be signed first' });
  }
  
  checklist.status = 'inventory_checked';
  await checklist.save();
  res.json(checklist);
  }  catch (error) {
    next(error); 
  }
};