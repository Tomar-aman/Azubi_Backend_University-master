import { Schema, model } from "mongoose";

// Schema for JobApplication
const jobApplicationSchema = new Schema({
  upperContent: { type: String, default: "" },
  lowerContent: { type: String, default: "" },
  coverLetterDynamicText: { type: String, default: "" },
});

// Schema for CompanyAppointment
const companyAppointmentSchema = new Schema({
  upperContent: { type: String, default: "" },
  lowerContent: { type: String, default: "" },
  appointmentLetterDynamicText: { type: String, default: "" },
});

// Schema for EmailContent
const emailContentSchema = new Schema({
  application: { type: jobApplicationSchema, default: null },
  appointment: { type: companyAppointmentSchema, default: null },
});

// Create the EmailContent model
const _EmailContentModel = model("EmailContent", emailContentSchema);

export default _EmailContentModel;
