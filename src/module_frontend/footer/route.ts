import { Router } from 'express';
import footerController from './footerController';

const router = Router();

// Routes for Footer
router.get('/footer', footerController.getFooter); // GET
router.post('/footer', footerController.createFooter); // POST
router.put('/footer', footerController.updateFooter); // PUT
router.post("/fetch-image",footerController.fetchImages)

export default router;
