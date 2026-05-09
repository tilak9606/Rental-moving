import express from 'express';
import {
  initiateMoveIn,
  getMyMoveIns,
  getLandlordMoveIns,
  uploadDocument,
  signAgreement,
  addInventoryItem,
  getInventoryItems,
  verifyInventory,
  completeMoveIn,
  landlordApproveInventory
} from '../controllers/moveInController.js';
import { auth, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/initiate', auth, authorize('tenant'), initiateMoveIn);
router.get('/my-moveins', auth, authorize('tenant'), getMyMoveIns);
router.get('/landlord-moveins', auth, authorize('landlord'), getLandlordMoveIns);
router.post('/:checklistId/documents', auth, authorize('tenant'), upload.single('document'), uploadDocument);
router.put('/:checklistId/sign-agreement', auth, authorize('tenant'), signAgreement);
router.post('/:checklistId/inventory', auth, authorize('tenant'), addInventoryItem);
router.get('/:checklistId/inventory', auth, getInventoryItems);
router.put('/inventory/:itemId/verify', auth, verifyInventory);
router.put('/:checklistId/landlord-approve-inventory', auth, authorize('landlord'), landlordApproveInventory);
router.put('/:checklistId/complete', auth, authorize('landlord'), completeMoveIn);

export default router;