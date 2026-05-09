import express from 'express';
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getMyProperties,
  shortlistProperty,
  getShortlist,
  removeShortlist,
  compareProperties
} from '../controllers/propertyController.js';
import { auth, authorize } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

router.post('/', auth, authorize('landlord'), uploadMultiple, createProperty);
router.get('/', getProperties);
router.get('/my-properties', auth, authorize('landlord'), getMyProperties);
router.get('/shortlist', auth, authorize('tenant'), getShortlist);
router.post('/shortlist', auth, authorize('tenant'), shortlistProperty);
router.delete('/shortlist/:id', auth, authorize('tenant'), removeShortlist);
router.post('/compare', auth, authorize('tenant'), compareProperties);
router.get('/:id', getPropertyById);
router.put('/:id', auth, authorize('landlord', 'admin'), uploadMultiple, updateProperty);
router.delete('/:id', auth, authorize('landlord', 'admin'), deleteProperty);

export default router;