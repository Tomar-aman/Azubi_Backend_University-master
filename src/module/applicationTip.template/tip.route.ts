import express from "express";
import ApplicationTipsController from "./tip.controller";

const tipRouter = express.Router();
const controller = new ApplicationTipsController();

tipRouter.put("/update", controller.updateTip);
tipRouter.get("/get_all_tips", controller.getAllTipsByFilter);
tipRouter.post("/", controller.createTip);
tipRouter.get("/", controller.getAllTips);
tipRouter.get("/:id", controller.getTipById);
tipRouter.delete("/:id", controller.deleteTip);

export default tipRouter;
