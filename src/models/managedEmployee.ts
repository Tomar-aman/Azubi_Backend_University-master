import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcrypt";

export interface ManagedEmployee {
  name: string;
  email: string;
  password?: string;
  phoneNo?: string;
  position?: string;
  permissions: string[]; // sidebar tab keys the employee can access
  createdBy: string;     // ManagedUser _id who created this employee
  status: "Active" | "Inactive";
}

export interface ManagedEmployeeDocument extends ManagedEmployee, Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const managedEmployeeSchema = new Schema<ManagedEmployeeDocument>(
  {
    name:        { type: String, required: true },
    email:       { type: String, required: true },
    password:    { type: String },
    phoneNo:     { type: String },
    position:    { type: String },
    permissions: { type: [String], default: [] },
    createdBy:   { type: String, required: true },
    status:      { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

managedEmployeeSchema.pre("save", async function (next) {
  const user = this as ManagedEmployeeDocument;
  if (!user.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password as string, salt);
    return next();
  } catch (error: any) {
    return next(error);
  }
});

managedEmployeeSchema.methods.comparePassword = async function (candidatePassword: string) {
  const user = this as ManagedEmployeeDocument;
  if (!user.password) return false;
  return await bcrypt.compare(candidatePassword, user.password);
};

managedEmployeeSchema.methods.updatePassword = async function (newPassword: string) {
  const user = this as ManagedEmployeeDocument;
  user.password = newPassword;
  await user.save();
};

const ManagedEmployeeModel = model<ManagedEmployeeDocument>(
  "ManagedEmployee",
  managedEmployeeSchema
);
export default ManagedEmployeeModel;
