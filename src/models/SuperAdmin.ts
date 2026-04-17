import mongoose, { Schema, Document } from "mongoose";

export interface ISuperAdmin extends Document {
  username: string;
  passwordHash: string; // In production, never store raw passwords
  role: string;
}

const SuperAdminSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: "SUPER_ADMIN" },
  },
  { timestamps: true }
);

export default mongoose.models.SuperAdmin ||
  mongoose.model<ISuperAdmin>("SuperAdmin", SuperAdminSchema);
