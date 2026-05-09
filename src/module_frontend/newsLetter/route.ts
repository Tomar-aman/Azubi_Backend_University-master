import { Router } from 'express';
import { FileHandler } from '../../utils/fileHandler';
import NewsletterFormController from './controller';

const router = Router();
const fileHandler = new FileHandler(); // Assuming you have a file handler class
const newsletterController = new NewsletterFormController(fileHandler);

// Define routes
router.post('/newsletter', (req, res) => newsletterController.createOrUpdateNewsletterForm(req, res));
router.get('/newsletter', (req, res) => newsletterController.getNewsletterForm(req, res));

export default router;
