import express, { Request, Response } from 'express';
import { getEnvironmentConfig } from '../controllers/globalEnvironments';
const router = express.Router();

// define the home page route
router.get('/globals', (req: Request, res: Response) => {
  res.send('Birds home page');
});

router.get('/global', getEnvironmentConfig);

export default router;
