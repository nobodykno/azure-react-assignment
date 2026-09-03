import { Router } from 'express';

import Route from './index.js';

const router: Router = Router();

router.use('/api/files', Route.FileRoute);


/**
 * Parent route to get health
 */
router.use('/api/health', Route.HealthRote);
export default router;
