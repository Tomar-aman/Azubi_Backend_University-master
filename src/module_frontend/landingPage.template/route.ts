import { Router } from 'express';
import { createLandingPageContent, getLandingPageContents, updateLandingPageContent } from './controller';


const router = Router();

router.put("/", updateLandingPageContent);
// Route to create a new ManageHomePage content with file uploads
router.post("/", createLandingPageContent);

// Route to get all ManageHomePage contents
router.get("/", getLandingPageContents);

// Route to update a ManageHomePage content by ID with file uploads

export default router;
