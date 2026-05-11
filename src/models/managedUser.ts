import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcrypt";

export interface ManagedUser {
  username: string;
  email: string;
  password: string;
  permissions: string[]; // sidebar tab keys the user can access
  createdBy?: string;   // admin's userId
  status: "Active" | "Inactive";
}

export interface ManagedUserDocument extends ManagedUser, Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidate: string) => Promise<boolean>;
}

const managedUserSchema = new Schema<ManagedUserDocument>(
  {
    username: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permissions: { type: [String], default: [] },
    createdBy: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

managedUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) { next(); return; }
  try {
    this.set("password", await bcrypt.hash(this.get("password"), 10));
    next();
  } catch (err: any) { next(err); }
});

managedUserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

const ManagedUserModel = model<ManagedUserDocument>("ManagedUser", managedUserSchema);
export default ManagedUserModel;
