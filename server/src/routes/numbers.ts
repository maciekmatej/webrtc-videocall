import express from 'express';
import { verifyCardNumber } from '../controllers/numbers';
import { sendSmsImmediately } from '../controllers/sms';
const router = express.Router();

router.get('/verifyCardNumber', verifyCardNumber);
router.post('/sendSms', sendSmsImmediately);

export default router;
