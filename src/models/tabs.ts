import { Schema, model, type Document } from "mongoose";

export interface Tabs {
  tab1: string;
  tab2: string;
  tab3: string;
  tab4: string;
  tab5: string;
  isDeleted: boolean;
}

export interface TabsDocument extends Tabs, Document {
  createdAt: Date;
  updatedAt: Date;
}

const tabsSchema = new Schema<TabsDocument>(
  {
    tab1: { type: String, required: true },
    tab2: { type: String, required: true },
    tab3: { type: String, required: true },
    tab4: { type: String, required: true },
    tab5: { type: String, required: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const TabsModel = model<TabsDocument>("Tabs", tabsSchema);

export default TabsModel;
