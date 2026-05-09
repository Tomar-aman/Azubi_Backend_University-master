import express from "express";
import ContactController from "./contact.controller";

const contactRoute = express.Router();
const contactController = new ContactController();

contactRoute.get(
  "/get_all_contacts_by_filter",
  contactController.getAllContactsByFilter,
);
contactRoute.get("/", contactController.getAllContacts);
contactRoute.get("/:id", contactController.getContactById);
contactRoute.post("/", contactController.addContact);
contactRoute.put("/", contactController.updateContactById);
contactRoute.delete("/:id", contactController.deleteContactById);

export default contactRoute;
