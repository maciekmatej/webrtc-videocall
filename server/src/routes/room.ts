import express from 'express';
import { checkIfRoomExists } from '../controllers/rooms';
const router = express.Router();

router.get('/checkIfRoomExists', checkIfRoomExists);

export default router;
