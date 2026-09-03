import { Router, raw } from 'express';

import controller from '../controller/index.js';


import { uploadMiddleware } from '../middleware/uploader.js';




const router: Router = Router({ mergeParams: true });


router.post(
  '/', 
  uploadMiddleware, 
  controller.FileController.uploadFiles);

  export default router;

