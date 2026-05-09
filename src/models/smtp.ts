import { Schema, model, type Document } from "mongoose";

export interface SmtpSetting {
  host: string;
  userName: string;
  encryption: string;
  port: number;
  password: string;
  address: string;
  service: string;
  to: string;
}

export interface SmtpSettingDocument extends SmtpSetting, Document {
  createdAt: Date;
  updatedAt: Date;
}

const smtpSettingSchema = new Schema<SmtpSettingDocument>(
  {
    host: { type: String, required: true },
    userName: { type: String, required: true },
    encryption: { type: String, required: true },
    port: { type: Number, required: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    service: { type: String, required: true },
    to: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const _SmtpSettingModel = model<SmtpSettingDocument>(
  "SmtpSetting",
  smtpSettingSchema,
);

export default _SmtpSettingModel;
