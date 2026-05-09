import { Schema, model, type Document } from "mongoose";

export interface SideBarContent {
  menu_1: string;
  menu_2: string;
  menu_3: string;
  menu_4: string;
  contact_label: string;
  contact_below_content: string;
}

export interface SideBarContentDocument extends SideBarContent, Document {
  createdAt: Date;
  updatedAt: Date;
}

const sideBarContentSchema = new Schema<SideBarContentDocument>(
  {
    menu_1: { type: String, required: true },
    menu_2: { type: String, required: true },
    menu_3: { type: String, required: true },
    menu_4: { type: String, required: true },
    contact_label: { type: String, required: true },
    contact_below_content: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const _SideBarContentModel = model<SideBarContentDocument>(
  "SideBarContent",
  sideBarContentSchema,
);

export default _SideBarContentModel;
