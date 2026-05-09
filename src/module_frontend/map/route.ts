import { Router } from "express";
import MapDetailController from "./mapController"; // Adjust the path

const router = Router();

// Route to create or update MapDetail
router.post("/map-detail", MapDetailController.createOrUpdate);

// Route to get MapDetail
router.get("/map-detail", MapDetailController.get);

export default router;
