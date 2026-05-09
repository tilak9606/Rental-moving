import express from 'express';
import {
  requestVisit,
  getMyVisits,
  getLandlordVisits,
  scheduleVisit,
  markVisited,
  makeDecision,
  cancelVisit,
  addFeedback
} from '../controllers/visitController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, authorize('tenant'), requestVisit);
router.get('/my-visits', auth, authorize('tenant'), getMyVisits);
router.get('/landlord-visits', auth, authorize('landlord'), getLandlordVisits);
router.put('/:visitId/schedule', auth, authorize('landlord'), scheduleVisit);
router.put('/:visitId/visited', auth, authorize('landlord'), markVisited);
router.put('/:visitId/decision', auth, authorize('landlord'), makeDecision);
router.put('/:visitId/cancel', auth, cancelVisit);
router.put('/:visitId/feedback', auth, authorize('tenant'), addFeedback);

export default router;